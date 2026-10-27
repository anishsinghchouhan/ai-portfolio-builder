import express from "express";
import { getDashboardSummary } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";
import { dashboardLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

/**
 * GET /api/v1/dashboard/summary
 * Protected route returning counts, analytics, main portfolio, and readiness
 */
router.get("/summary", protect, dashboardLimiter, getDashboardSummary);

export default router;
