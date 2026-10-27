import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import { getDashboardSummaryForUser } from "../services/dashboardService.js";

/**
 * GET /api/v1/dashboard/summary
 * Thin controller: validates authentication and delegates business logic to dashboardService
 */
export const getDashboardSummary = catchAsync(async (req, res, next) => {
  const userId = req.user?.id;
  if (!userId) {
    return next(new AppError("User authentication required.", 401, "UNAUTHORIZED"));
  }

  // Fetch summary data strictly for the authenticated user
  const summary = await getDashboardSummaryForUser(userId);

  res.status(200).json({
    success: true,
    data: summary,
  });
});

export default {
  getDashboardSummary,
};
