import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import prisma from "../config/prisma.js";

/**
 * GET /api/v1/users/me
 * Returns authenticated user's profile from Prisma DB
 */
export const getMe = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError("User identity missing.", 401, "UNAUTHORIZED"));
  }

  res.status(200).json({
    success: true,
    data: {
      id: req.user.id,
      supabaseUserId: req.user.supabaseUserId,
      email: req.user.email,
      fullName: req.user.fullName,
      avatarUrl: req.user.avatarUrl,
      role: req.user.role,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    },
  });
});

/**
 * PATCH /api/v1/users/me
 * Updates allowed profile fields (fullName, avatarUrl)
 */
export const updateMe = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError("User identity missing.", 401, "UNAUTHORIZED"));
  }

  const { fullName, avatarUrl } = req.body;

  // Validate input
  if (fullName !== undefined && typeof fullName !== "string") {
    return next(new AppError("Invalid fullName format.", 400, "BAD_REQUEST"));
  }

  if (avatarUrl !== undefined && avatarUrl !== null && typeof avatarUrl !== "string") {
    return next(new AppError("Invalid avatarUrl format.", 400, "BAD_REQUEST"));
  }

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      ...(fullName !== undefined && { fullName: fullName.trim() }),
      ...(avatarUrl !== undefined && { avatarUrl }),
    },
  });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      id: updatedUser.id,
      supabaseUserId: updatedUser.supabaseUserId,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      avatarUrl: updatedUser.avatarUrl,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    },
  });
});

export default { getMe, updateMe };
