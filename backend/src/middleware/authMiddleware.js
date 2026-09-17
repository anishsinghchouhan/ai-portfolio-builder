import { createClient } from "@supabase/supabase-js";
import env from "../config/env.js";
import prisma from "../config/prisma.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

// Initialize backend Supabase client for token validation
const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("[Supabase Admin] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend environment.");
}

export const supabaseAdmin = createClient(supabaseUrl || "", supabaseKey || "");

export const protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("Authentication required. Please log in to get access.", 401, "UNAUTHORIZED"));
  }

  try {
    // Validate JWT using Supabase Auth
    const { data: { user: supabaseUser }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !supabaseUser) {
      return next(new AppError("Invalid or expired authentication token.", 401, "UNAUTHORIZED"));
    }

    // Find or sync user in Prisma PostgreSQL DB
    const fullName = supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.fullName || (supabaseUser.email ? supabaseUser.email.split("@")[0] : null);
    const avatarUrl = supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.avatarUrl || null;

    const dbUser = await prisma.user.upsert({
      where: { supabaseUserId: supabaseUser.id },
      update: {},
      create: {
        supabaseUserId: supabaseUser.id,
        email: supabaseUser.email,
        fullName,
        avatarUrl,
        role: "USER",
      },
    });

    // Attach trusted Prisma user identity and raw Supabase auth object to request
    req.user = dbUser;
    req.auth = {
      supabaseUserId: supabaseUser.id,
      email: supabaseUser.email,
      user: supabaseUser,
    };

    next();
  } catch (err) {
    return next(new AppError("Failed to authenticate token with Supabase.", 401, "UNAUTHORIZED"));
  }
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role || req.auth?.user?.user_metadata?.role || req.auth?.user?.role || "USER";
    if (!roles.includes(userRole)) {
      return next(new AppError("You do not have permission to perform this action.", 403, "FORBIDDEN"));
    }
    next();
  };
};

export default { protect, restrictTo };
