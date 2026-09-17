import express from "express";
import {
  getPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  publishPortfolio,
} from "../controllers/portfolioController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Private protected portfolio endpoints
router.get("/", protect, getPortfolios);
router.get("/:id", protect, getPortfolioById);
router.post("/", protect, createPortfolio);
router.patch("/:id", protect, updatePortfolio);
router.delete("/:id", protect, deletePortfolio);
router.patch("/:id/publish", protect, publishPortfolio);

export default router;
