import express from "express";
import multer from "multer";
import {
  getResumes,
  uploadResume,
  createResume,
  deleteResume,
  analyzeResume,
} from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { aiLimiter, uploadLimiter } from "../middleware/rateLimiter.js";
import AppError from "../utils/AppError.js";

const router = express.Router();

// Multer memoryStorage with single field "file" and 5 MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

// Middleware wrapper to handle multer errors (e.g. LIMIT_FILE_SIZE) cleanly
export const handleMulterUpload = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(new AppError("File is too large. Maximum allowed size is 5 MB.", 400, "LIMIT_FILE_SIZE"));
      }
      return next(new AppError(err.message || "File upload failed.", 400, "UPLOAD_ERROR"));
    }
    next();
  });
};

// All resume routes require authentication
router.use(protect);

router.get("/", getResumes);
router.post("/upload", uploadLimiter, handleMulterUpload, uploadResume);
router.post("/", createResume);
router.delete("/:id", deleteResume);

// AI Resume Analysis (guarded by protect and strict aiLimiter)
router.post("/:id/analyze", aiLimiter, analyzeResume);

export default router;
