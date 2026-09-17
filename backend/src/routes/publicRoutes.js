import express from "express";
import { getPublicPortfolioBySlug } from "../controllers/portfolioController.js";

const router = express.Router();

// Public endpoint for published portfolios (No Auth required)
router.get("/portfolios/:slug", getPublicPortfolioBySlug);

export default router;
