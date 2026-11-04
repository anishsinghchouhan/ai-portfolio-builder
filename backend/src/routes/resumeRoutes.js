import express from "express";
import {
  getResumes,
  createResume,
  deleteResume,
} from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All resume routes require authentication
router.use(protect);

router.get("/", getResumes);
router.post("/", createResume);
router.delete("/:id", deleteResume);

export default router;

