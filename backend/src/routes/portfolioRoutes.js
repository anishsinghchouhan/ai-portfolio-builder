import express from "express";
import {
  getPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  publishPortfolio,
  generatePortfolioTheme,
} from "../controllers/portfolioController.js";
import { protect } from "../middleware/authMiddleware.js";
import { aiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Private protected portfolio endpoints
router.get("/", protect, getPortfolios);
router.get("/:id", protect, getPortfolioById);
router.post("/", protect, createPortfolio);
router.patch("/:id", protect, updatePortfolio);
router.delete("/:id", protect, deletePortfolio);
router.patch("/:id/publish", protect, publishPortfolio);

// AI Theme Generation endpoint (guarded by protect and strict aiLimiter)
router.post("/:id/theme/generate", protect, aiLimiter, generatePortfolioTheme);

export default router;
