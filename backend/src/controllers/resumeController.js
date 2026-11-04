import { z } from "zod";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import prisma from "../config/prisma.js";
import { invalidateDashboardSummaryCache } from "../services/dashboardService.js";

// Helper to ensure authenticated user identity exists
const getDbUser = (req) => {
  if (req.user && req.user.id) {
    return req.user;
  }
  throw new AppError("Authenticated user identity missing.", 401, "UNAUTHORIZED");
};

// Validation schema for creating a resume record
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
 * Retrieve all active resumes for the authenticated user
 */
export const getResumes = catchAsync(async (req, res, next) => {
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
 * POST /api/v1/resumes
 * Record an uploaded and AI-parsed resume for the user
 */
export const createResume = catchAsync(async (req, res, next) => {
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
 * Delete or deactivate a resume belonging to the authenticated user
 */
export const deleteResume = catchAsync(async (req, res, next) => {
  const dbUser = getDbUser(req);
  const { id } = req.params;

  const existingResume = await prisma.resume.findFirst({
    where: {
      id,
      userId: dbUser.id,
    },
  });

  if (!existingResume) {
    return next(new AppError("Resume not found or access denied.", 404, "NOT_FOUND"));
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

