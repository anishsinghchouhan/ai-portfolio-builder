import { z } from "zod";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import prisma from "../config/prisma.js";

// Helper for validating optional HTTP/HTTPS URL or null/empty
const optionalUrlSchema = (fieldName, maxLength = 255) =>
  z
    .string()
    .trim()
    .max(maxLength, `${fieldName} cannot exceed ${maxLength} characters`)
    .refine(
      (val) => !val || /^https?:\/\/.+/i.test(val),
      `${fieldName} must be a valid URL starting with http:// or https://`
    )
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .optional();

// Helper for optional trimmed strings with max length or null/empty
const optionalStringSchema = (fieldName, maxLength) =>
  z
    .string()
    .trim()
    .max(maxLength, `${fieldName} cannot exceed ${maxLength} characters`)
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .optional();

/**
 * Zod schema for updating user profile.
 * .strict() ensures ANY unknown or forbidden fields (id, email, role, supabaseUserId, etc.) are rejected with 400.
 */
const updateProfileSchema = z
  .object({
    fullName: optionalStringSchema("Full Name", 100),
    headline: optionalStringSchema("Headline", 150),
    bio: optionalStringSchema("Bio", 1000),
    location: optionalStringSchema("Location", 100),
    phone: optionalStringSchema("Phone", 30),
    github: optionalUrlSchema("GitHub", 255),
    linkedin: optionalUrlSchema("LinkedIn", 255),
    website: optionalUrlSchema("Website", 255),
    avatarUrl: optionalUrlSchema("Avatar URL", 1000),
  })
  .strict({ message: "Unknown fields are not allowed in profile update." });

/**
 * GET /api/v1/users/me
 * Returns authenticated user's profile from Prisma DB (matching logged-in supabaseUserId)
 */
export const getMe = catchAsync(async (req, res, next) => {
  const supabaseUserId = req.auth?.supabaseUserId || req.user?.supabaseUserId;
  if (!supabaseUserId) {
    return next(new AppError("User identity missing.", 401, "UNAUTHORIZED"));
  }

  const user = await prisma.user.findUnique({
    where: { supabaseUserId },
    select: {
      id: true,
      supabaseUserId: true,
      email: true,
      fullName: true,
      headline: true,
      bio: true,
      location: true,
      phone: true,
      github: true,
      linkedin: true,
      website: true,
      avatarUrl: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return next(new AppError("User profile not found in database.", 404, "NOT_FOUND"));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * PATCH /api/v1/users/me
 * Updates allowed profile fields with strict Zod validation.
 * Targets ONLY the row where supabaseUserId equals the logged-in user.
 */
export const updateMe = catchAsync(async (req, res, next) => {
  const supabaseUserId = req.auth?.supabaseUserId || req.user?.supabaseUserId;
  if (!supabaseUserId) {
    return next(new AppError("User identity missing.", 401, "UNAUTHORIZED"));
  }

  // Parse and validate with strict Zod schema (.strict() automatically rejects id, email, role, supabaseUserId, etc.)
  const parseResult = updateProfileSchema.safeParse(req.body);
  if (!parseResult.success) {
    const errorMessages = parseResult.error.errors
      .map((e) => {
        const field = e.path.join(".");
        return field ? `${field}: ${e.message}` : e.message;
      })
      .join("; ");

    return next(new AppError(errorMessages, 400, "VALIDATION_ERROR", parseResult.error.format()));
  }

  const validatedData = parseResult.data;

  // Filter out undefined keys so we only update provided fields
  const dataToUpdate = {};
  for (const [key, val] of Object.entries(validatedData)) {
    if (val !== undefined) {
      dataToUpdate[key] = val;
    }
  }

  if (Object.keys(dataToUpdate).length === 0) {
    return next(new AppError("No valid profile fields provided for update.", 400, "BAD_REQUEST"));
  }

  // Update only the row where supabaseUserId equals the logged-in user
  const updatedUser = await prisma.user.update({
    where: { supabaseUserId },
    data: dataToUpdate,
    select: {
      id: true,
      supabaseUserId: true,
      email: true,
      fullName: true,
      headline: true,
      bio: true,
      location: true,
      phone: true,
      github: true,
      linkedin: true,
      website: true,
      avatarUrl: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

export default { getMe, updateMe };
