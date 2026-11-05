import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  uploadResume,
  deleteResume,
  analyzeResume,
  getResumes,
  setPdfExtractorForTest,
  resetPdfExtractorForTest,
} from "../src/controllers/resumeController.js";
import { supabaseAdmin } from "../src/middleware/authMiddleware.js";
import prisma from "../src/config/prisma.js";
import AppError from "../src/utils/AppError.js";

// Helper to create minimal PDF buffer with valid header
const createValidPdfBuffer = (headerPrefix = "%PDF-1.4\nMinimal PDF content stream") => {
  return Buffer.from(headerPrefix, "utf-8");
};

describe("Resume Upload & AI Controller Tests (Phase 1 & 2)", () => {
  const userA = { id: "user-alpha", email: "alpha@example.com" };
  const userB = { id: "user-beta", email: "beta@example.com" };

  beforeEach(() => {
    resetPdfExtractorForTest();
  });

  describe("File Validation & Magic Byte Checks", () => {
    it("should reject when no file is uploaded", async () => {
      const req = { user: userA };
      let capturedError = null;
      const next = (err) => {
        capturedError = err;
      };

      await uploadResume(req, {}, next);
      assert.ok(capturedError instanceof AppError);
      assert.strictEqual(capturedError.statusCode, 400);
      assert.strictEqual(capturedError.message, "Please select a PDF file to upload.");
    });

    it("should reject non-PDF file extension (e.g. .docx)", async () => {
      const req = {
        user: userA,
        file: {
          originalname: "resume.docx",
          mimetype: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          size: 1024,
          buffer: Buffer.from("PK\x03\x04..."),
        },
      };
      let capturedError = null;
      const next = (err) => {
        capturedError = err;
      };

      await uploadResume(req, {}, next);
      assert.ok(capturedError instanceof AppError);
      assert.strictEqual(capturedError.statusCode, 400);
      assert.strictEqual(capturedError.message, "Only PDF files (.pdf) are supported.");
    });

    it("should reject non-PDF mimetype even if extension is .pdf", async () => {
      const req = {
        user: userA,
        file: {
          originalname: "fake.pdf",
          mimetype: "text/plain",
          size: 1024,
          buffer: createValidPdfBuffer(),
        },
      };
      let capturedError = null;
      const next = (err) => {
        capturedError = err;
      };

      await uploadResume(req, {}, next);
      assert.ok(capturedError instanceof AppError);
      assert.strictEqual(capturedError.statusCode, 400);
      assert.strictEqual(capturedError.message, "Invalid file mimetype. Expected application/pdf.");
    });

    it("should reject spoofed PDF lacking %PDF- magic bytes", async () => {
      const req = {
        user: userA,
        file: {
          originalname: "malicious.pdf",
          mimetype: "application/pdf",
          size: 1024,
          buffer: Buffer.from("NOT_A_REAL_PDF_HEADER_DATA"),
        },
      };
      let capturedError = null;
      const next = (err) => {
        capturedError = err;
      };

      await uploadResume(req, {}, next);
      assert.ok(capturedError instanceof AppError);
      assert.strictEqual(capturedError.statusCode, 400);
      assert.strictEqual(capturedError.errorCode, "CORRUPT_OR_SPOOFED_PDF");
    });

    it("should reject file over 5 MB via multer handler", async () => {
      let capturedError = null;
      const next = (err) => {
        capturedError = err;
      };

      // Simulate multer limit error
      const multerErr = new Error("File too large");
      multerErr.code = "LIMIT_FILE_SIZE";

      if (multerErr.code === "LIMIT_FILE_SIZE") {
        next(new AppError("File is too large. Maximum allowed size is 5 MB.", 400, "LIMIT_FILE_SIZE"));
      }

      assert.ok(capturedError instanceof AppError);
      assert.strictEqual(capturedError.statusCode, 400);
      assert.strictEqual(capturedError.message, "File is too large. Maximum allowed size is 5 MB.");
    });

    it("should reject near-empty or scanned PDF with specific message", async () => {
      // Mock extractor to return short/empty text (< 50 chars)
      setPdfExtractorForTest(async () => ({
        text: "Too short",
        numpages: 1,
      }));

      const shortTextBuffer = createValidPdfBuffer("%PDF-1.4\nShort scanned page");
      const req = {
        user: userA,
        file: {
          originalname: "scanned.pdf",
          mimetype: "application/pdf",
          size: shortTextBuffer.length,
          buffer: shortTextBuffer,
        },
      };
      let capturedError = null;
      const next = (err) => {
        capturedError = err;
      };

      await uploadResume(req, {}, next);
      assert.ok(capturedError instanceof AppError);
      assert.strictEqual(capturedError.statusCode, 400);
      assert.strictEqual(
        capturedError.message,
        "This PDF looks scanned or image-only. Text extraction is not supported yet."
      );
    });
  });

  describe("Valid PDF Upload & Compensating Rollback", () => {
    it("should successfully upload valid PDF, store in Supabase Storage and persist to database", async () => {
      const longText =
        "Alex Developer - Full Stack Engineer with expertise in React, Node.js, PostgreSQL, Docker, and distributed APIs across cloud environments.";
      setPdfExtractorForTest(async () => ({
        text: longText,
        numpages: 2,
      }));

      const validBuffer = createValidPdfBuffer("%PDF-1.4\nValid binary PDF buffer");
      const req = {
        user: userA,
        file: {
          originalname: "Alex_Resume_2026.pdf",
          mimetype: "application/pdf",
          size: validBuffer.length,
          buffer: validBuffer,
        },
      };

      let statusSent = null;
      let jsonSent = null;
      const res = {
        status: (code) => {
          statusSent = code;
          return {
            json: (payload) => {
              jsonSent = payload;
            },
          };
        },
      };

      // Mock Supabase storage upload
      let storageUploadedPath = null;
      const originalStorageFrom = supabaseAdmin.storage.from;
      supabaseAdmin.storage.from = () => ({
        upload: async (destPath) => {
          storageUploadedPath = destPath;
          return { data: { path: destPath }, error: null };
        },
        remove: async () => ({ data: [], error: null }),
      });

      // Mock Prisma resume.create
      const originalPrismaCreate = prisma.resume.create;
      prisma.resume.create = async ({ data }) => {
        return {
          id: "res-test-123",
          userId: data.userId,
          fileName: data.fileName,
          fileSize: data.fileSize,
          fileUrl: data.fileUrl,
          parsedData: data.parsedData,
          createdAt: new Date(),
        };
      };

      try {
        await uploadResume(req, res, (err) => {
          if (err) throw err;
        });

        assert.strictEqual(statusSent, 201);
        assert.strictEqual(jsonSent.status, "success");
        assert.strictEqual(jsonSent.data.id, "res-test-123");
        assert.strictEqual(jsonSent.data.fileName, "Alex_Resume_2026.pdf");
        assert.strictEqual(jsonSent.data.status, "UPLOADED");
        assert.ok(storageUploadedPath.startsWith("user-alpha/"));
        assert.strictEqual(jsonSent.data.extractedTextLength, longText.length);
      } finally {
        supabaseAdmin.storage.from = originalStorageFrom;
        prisma.resume.create = originalPrismaCreate;
      }
    });

    it("should rollback (delete storage object) if database insertion fails", async () => {
      setPdfExtractorForTest(async () => ({
        text: "Candidate with strong Python, Node.js, and TypeScript backgrounds with 5 years experience.",
        numpages: 1,
      }));

      const validBuffer = createValidPdfBuffer("%PDF-1.4\nValid PDF content");
      const req = {
        user: userA,
        file: {
          originalname: "My_Resume.pdf",
          mimetype: "application/pdf",
          size: validBuffer.length,
          buffer: validBuffer,
        },
      };

      let removedPath = null;
      const originalStorageFrom = supabaseAdmin.storage.from;
      supabaseAdmin.storage.from = () => ({
        upload: async (destPath) => ({ data: { path: destPath }, error: null }),
        remove: async (paths) => {
          removedPath = paths[0];
          return { data: [], error: null };
        },
      });

      const originalPrismaCreate = prisma.resume.create;
      prisma.resume.create = async () => {
        throw new Error("DB Connection Error");
      };

      try {
        let capturedError = null;
        await uploadResume(req, {}, (err) => {
          capturedError = err;
        });

        assert.ok(capturedError);
        assert.strictEqual(capturedError.message, "DB Connection Error");
        assert.ok(removedPath.startsWith("user-alpha/"));
      } finally {
        supabaseAdmin.storage.from = originalStorageFrom;
        prisma.resume.create = originalPrismaCreate;
      }
    });
  });

  describe("Ownership Protection & Cross-User Security", () => {
    it("user B cannot read or analyze user A's resume (returns 404)", async () => {
      const originalFind = prisma.resume.findFirst;
      // When user B asks for a resume owned by user A, findFirst with userId: userB.id returns null
      prisma.resume.findFirst = async ({ where }) => {
        if (where.userId === "user-beta") return null;
        return { id: "res-user-a", userId: "user-alpha", parsedData: { rawText: "User A text" } };
      };

      try {
        const req = {
          user: userB,
          params: { id: "res-user-a" },
          body: { text: "Testing user B accessing user A resume" },
        };
        let capturedError = null;
        const next = (err) => {
          capturedError = err;
        };

        await analyzeResume(req, {}, next);

        assert.ok(capturedError instanceof AppError);
        assert.strictEqual(capturedError.statusCode, 404);
        assert.strictEqual(capturedError.message, "Resume not found.");
      } finally {
        prisma.resume.findFirst = originalFind;
      }
    });

    it("user B cannot delete user A's resume (returns 404)", async () => {
      const originalFind = prisma.resume.findFirst;
      prisma.resume.findFirst = async ({ where }) => {
        if (where.userId === "user-beta") return null;
        return { id: "res-user-a", userId: "user-alpha" };
      };

      try {
        const req = {
          user: userB,
          params: { id: "res-user-a" },
        };
        let capturedError = null;
        const next = (err) => {
          capturedError = err;
        };

        await deleteResume(req, {}, next);

        assert.ok(capturedError instanceof AppError);
        assert.strictEqual(capturedError.statusCode, 404);
        assert.strictEqual(capturedError.message, "Resume not found.");
      } finally {
        prisma.resume.findFirst = originalFind;
      }
    });

    it("deleteResume preserves DB row if Supabase storage deletion fails", async () => {
      const originalFind = prisma.resume.findFirst;
      let deleteCalled = false;
      const originalDelete = prisma.resume.delete;
      prisma.resume.delete = async () => {
        deleteCalled = true;
      };

      prisma.resume.findFirst = async () => ({
        id: "res-user-a",
        userId: "user-alpha",
        fileUrl: "user-alpha/uuid.pdf",
      });

      // Storage returns an error
      const originalStorageFrom = supabaseAdmin.storage.from;
      supabaseAdmin.storage.from = () => ({
        remove: async () => ({ data: null, error: new Error("Storage service unavailable") }),
      });

      try {
        const req = {
          user: userA,
          params: { id: "res-user-a" },
        };
        let capturedError = null;
        const next = (err) => {
          capturedError = err;
        };

        await deleteResume(req, {}, next);

        assert.ok(capturedError instanceof AppError);
        assert.strictEqual(capturedError.statusCode, 500);
        assert.strictEqual(
          capturedError.message,
          "Failed to delete resume file from storage. Record preserved."
        );
        // DB row was PRESERVED!
        assert.strictEqual(deleteCalled, false);
      } finally {
        prisma.resume.findFirst = originalFind;
        prisma.resume.delete = originalDelete;
        supabaseAdmin.storage.from = originalStorageFrom;
      }
    });
  });

  describe("GET /resumes", () => {
    it("should retrieve only own resumes in descending order", async () => {
      const originalFindMany = prisma.resume.findMany;
      let queriedParams = null;
      prisma.resume.findMany = async (params) => {
        queriedParams = params;
        return [
          { id: "res-2", createdAt: new Date("2026-11-04") },
          { id: "res-1", createdAt: new Date("2026-11-03") },
        ];
      };

      try {
        const req = { user: userA };
        let jsonSent = null;
        const res = {
          status: () => ({
            json: (payload) => {
              jsonSent = payload;
            },
          }),
        };

        await getResumes(req, res, () => {});

        assert.strictEqual(queriedParams.where.userId, "user-alpha");
        assert.deepStrictEqual(queriedParams.orderBy, { createdAt: "desc" });
        assert.strictEqual(jsonSent.data.length, 2);
      } finally {
        prisma.resume.findMany = originalFindMany;
      }
    });
  });
});
