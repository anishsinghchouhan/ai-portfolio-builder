import crypto from "node:crypto";
import path from "node:path";
import { PDFParse } from "pdf-parse";
import { z } from "zod";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import prisma from "../config/prisma.js";
import env from "../config/env.js";
import { supabaseAdmin } from "../middleware/authMiddleware.js";
import { invalidateDashboardSummaryCache } from "../services/dashboardService.js";
import { analyzeResumeText } from "../services/geminiService.js";

/**
 * Safely extract text from PDF buffer using PDFParse
 */
export const extractTextFromPdfBuffer = async (buffer) => {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return {
      text: (result?.text || "").trim(),
      numpages: result?.total || result?.pages?.length || 1,
    };
  } finally {
    await parser.destroy().catch(() => {});
  }
};

export let pdfExtractor = extractTextFromPdfBuffer;
export const setPdfExtractorForTest = (fn) => {
  pdfExtractor = fn;
};
export const resetPdfExtractorForTest = () => {
  pdfExtractor = extractTextFromPdfBuffer;
};

// Helper to ensure authenticated user identity exists
const getDbUser = (req) => {
  if (req.user && req.user.id) {
    return req.user;
  }
  throw new AppError("Authenticated user identity missing.", 401, "UNAUTHORIZED");
};

// Validation schema for creating a resume record (metadata)
export const createResumeSchema = z
  .object({
    fileName: z
      .string({ required_error: "fileName is required" })
      .trim()
      .min(1, "fileName cannot be empty")
      .max(255, "fileName cannot exceed 255 characters"),
    fileSize: z
      .number({ required_error: "fileSize is required" })
      .int("fileSize must be an integer")
      .positive("fileSize must be positive")
      .max(10 * 1024 * 1024, "fileSize cannot exceed 10 MB"),
    fileUrl: z
      .string()
      .trim()
      .max(1000)
      .optional()
      .default("/uploads/resume.pdf"),
    parsedData: z
      .record(z.any())
      .optional()
      .nullable(),
  })
  .strict({ message: "Unknown fields in resume creation payload." });

/**
 * GET /api/v1/resumes
 * Retrieve all active resumes for the authenticated user (newest first)
 */
export const getResumes = catchAsync(async (req, res, _next) => {
  const dbUser = getDbUser(req);

  const resumes = await prisma.resume.findMany({
    where: {
      userId: dbUser.id,
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    status: "success",
    data: resumes,
  });
});

/**
 * POST /api/v1/resumes/upload
 * Handle PDF file upload, validate format & magic bytes, extract text, upload to Supabase Storage, and persist row
 */
export const uploadResume = catchAsync(async (req, res, next) => {
  const dbUser = getDbUser(req);

  // 1. Validate file presence
  if (!req.file || !req.file.buffer) {
    return next(new AppError("Please select a PDF file to upload.", 400, "BAD_REQUEST"));
  }

  const { originalname, mimetype, size, buffer } = req.file;

  // 2. Validate file extension (.pdf)
  const ext = path.extname(originalname || "").toLowerCase();
  if (ext !== ".pdf") {
    return next(new AppError("Only PDF files (.pdf) are supported.", 400, "INVALID_FILE_TYPE"));
  }

  // 3. Validate mimetype
  if (mimetype !== "application/pdf") {
    return next(new AppError("Invalid file mimetype. Expected application/pdf.", 400, "INVALID_MIMETYPE"));
  }

  // 4. Validate magic bytes (%PDF-)
  if (buffer.length < 5 || buffer.subarray(0, 5).toString("ascii") !== "%PDF-") {
    return next(new AppError("Invalid PDF header. File failed magic byte verification.", 400, "CORRUPT_OR_SPOOFED_PDF"));
  }

  // 5. Extract text with pdf-parse (cap pages to 10 and characters to 50,000)
  let extractedText = "";
  let pageCount = 1;
  try {
    const parsed = await pdfExtractor(buffer);
    extractedText = (parsed?.text || "").slice(0, 50000).trim();
    pageCount = parsed?.numpages || 1;
  } catch {
    return next(new AppError("Failed to parse PDF document. The file might be corrupted or password-protected.", 400, "PDF_PARSE_FAILED"));
  }

  // If text is near empty (< 50 characters)
  if (!extractedText || extractedText.length < 50) {
    return next(new AppError("This PDF looks scanned or image-only. Text extraction is not supported yet.", 400, "EMPTY_TEXT"));
  }

  // 6. Upload to Supabase Storage bucket at path `${user.id}/${uuid}.pdf`
  const bucket = env.SUPABASE_STORAGE_BUCKET || "resumes";
  const fileUuid = crypto.randomUUID();
  const storagePath = `${dbUser.id}/${fileUuid}.pdf`;

  const { error: storageError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(storagePath, buffer, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (storageError) {
    return next(new AppError("Failed to upload resume file to storage.", 500, "STORAGE_ERROR"));
  }

  // 7. Sanitize filename and save resume row in Prisma
  const sanitizedFileName = path
    .basename(originalname)
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 200) || "resume.pdf";

  let newResume;
  try {
    newResume = await prisma.resume.create({
      data: {
        userId: dbUser.id,
        fileName: sanitizedFileName,
        fileSize: size,
        fileUrl: storagePath, // Storage path (not a public URL)
        parsedData: {
          rawText: extractedText,
          charCount: extractedText.length,
          pageCount: pageCount || 1,
        },
        isActive: true,
      },
    });
  } catch (dbErr) {
    // If DB insert fails, delete the storage object (compensating rollback)
    await supabaseAdmin.storage.from(bucket).remove([storagePath]).catch(() => {});
    throw dbErr;
  }

  // Invalidate dashboard summary cache so counts and timeline update
  invalidateDashboardSummaryCache(dbUser.id);

  // 8. Response (never return raw text if large)
  res.status(201).json({
    status: "success",
    data: {
      id: newResume.id,
      fileName: newResume.fileName,
      extractedTextLength: extractedText.length,
      status: "UPLOADED",
    },
  });
});

/**
 * POST /api/v1/resumes
 * Record a resume metadata record for the user
 */
export const createResume = catchAsync(async (req, res, _next) => {
  const dbUser = getDbUser(req);

  const validated = createResumeSchema.parse(req.body);

  const newResume = await prisma.resume.create({
    data: {
      userId: dbUser.id,
      fileName: validated.fileName,
      fileSize: validated.fileSize,
      fileUrl: validated.fileUrl || `/uploads/${validated.fileName}`,
      parsedData: validated.parsedData || null,
      isActive: true,
    },
  });

  // Invalidate dashboard summary cache so readiness and activity update instantly
  invalidateDashboardSummaryCache(dbUser.id);

  res.status(201).json({
    status: "success",
    message: "Resume saved successfully",
    data: newResume,
  });
});

/**
 * DELETE /api/v1/resumes/:id
 * Delete storage object and database row (if storage delete fails, keep the row)
 */
export const deleteResume = catchAsync(async (req, res, next) => {
  const dbUser = getDbUser(req);
  const { id } = req.params;

  // Strict ownership check: 404 if not found or not yours
  const existingResume = await prisma.resume.findFirst({
    where: {
      id,
      userId: dbUser.id,
    },
  });

  if (!existingResume) {
    return next(new AppError("Resume not found.", 404, "NOT_FOUND"));
  }

  // Delete storage object if stored in Supabase
  if (existingResume.fileUrl && !existingResume.fileUrl.startsWith("/uploads/")) {
    const bucket = env.SUPABASE_STORAGE_BUCKET || "resumes";
    const { error: storageError } = await supabaseAdmin.storage
      .from(bucket)
      .remove([existingResume.fileUrl]);

    // Rule: "if storage delete fails, keep the row"
    if (storageError) {
      return next(
        new AppError(
          "Failed to delete resume file from storage. Record preserved.",
          500,
          "STORAGE_DELETE_FAILED"
        )
      );
    }
  }

  await prisma.resume.delete({
    where: {
      id,
    },
  });

  // Invalidate dashboard cache
  invalidateDashboardSummaryCache(dbUser.id);

  res.status(200).json({
    status: "success",
    message: "Resume deleted successfully",
  });
});

/**
 * POST /api/v1/resumes/:id/analyze
 * Analyze candidate resume text with Gemini AI (own resume only, 404 if not yours)
 */
export const analyzeResume = catchAsync(async (req, res, next) => {
  const dbUser = getDbUser(req);
  const { id } = req.params;

  // Strict ownership check: 404 if not found or not yours
  const existingResume = await prisma.resume.findFirst({
    where: {
      id,
      userId: dbUser.id,
    },
  });

  if (!existingResume) {
    return next(new AppError("Resume not found.", 404, "NOT_FOUND"));
  }

  // Accept a test "text" field from body or fallback to stored rawText
  const resumeText =
    req.body?.text ||
    (typeof existingResume.parsedData === "object" && existingResume.parsedData?.rawText);

  if (!resumeText || typeof resumeText !== "string" || !resumeText.trim()) {
    return next(new AppError("Resume text is required for analysis.", 400, "BAD_REQUEST"));
  }

  // Analyze resume text with Gemini AI (strict JSON, retry, prompt injection prevention)
  const analysis = await analyzeResumeText(resumeText.trim());

  // Persist extracted structured data to database
  const updatedResume = await prisma.resume.update({
    where: {
      id,
    },
    data: {
      parsedData: {
        ...(typeof existingResume.parsedData === "object" ? existingResume.parsedData : {}),
        ...analysis,
        analysis,
      },
    },
  });

  // Invalidate dashboard summary cache so readiness updates immediately
  invalidateDashboardSummaryCache(dbUser.id);

  res.status(200).json({
    status: "success",
    message: "Resume analyzed successfully",
    data: {
      resume: updatedResume,
      analysis,
    },
  });
});

export default {
  getResumes,
  uploadResume,
  createResume,
  deleteResume,
  analyzeResume,
};
