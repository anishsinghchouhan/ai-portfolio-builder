import { createClient } from "@supabase/supabase-js";
import env from "../config/env.js";
import prisma from "../config/prisma.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import logger from "../utils/logger.js";

// Initialize backend Supabase client for token validation
const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  logger.error("[Supabase Admin] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend environment.");
}

export const supabaseAdmin = createClient(supabaseUrl || "", supabaseKey || "");

// In-memory cache for verified users: Map<supabaseUserId, { dbUser, auth, expiresAt }>
const userCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

// Prune expired cache entries periodically
const pruneExpiredCache = () => {
  const now = Date.now();
  for (const [key, entry] of userCache.entries()) {
    if (entry.expiresAt <= now) {
      userCache.delete(key);
    }
  }
};

export const clearUserCache = (supabaseUserId) => {
  if (supabaseUserId) {
    userCache.delete(supabaseUserId);
  } else {
    userCache.clear();
  }
};

export const protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Authentication required. Please log in to get access.", 401, "UNAUTHORIZED"));
  }

  // 1. Validate JWT with Supabase Auth (Invalid/missing token = 401)
  let supabaseUser;
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) {
      return next(new AppError("Invalid or expired authentication token.", 401, "UNAUTHORIZED"));
    }
    supabaseUser = data.user;
  } catch (err) {
    return next(new AppError("Failed to authenticate token with Supabase.", 401, "UNAUTHORIZED"));
  }

  // 2. Check 60-second in-memory cache
  const now = Date.now();
  const cached = userCache.get(supabaseUser.id);
  if (cached && cached.expiresAt > now) {
    req.user = cached.dbUser;
    req.auth = cached.auth;
    return next();
  }

  // 3. Database operations: findUnique first, create user only when missing, catch P2002.
  // Return 503 for database errors, NEVER 401.
  let dbUser;
  try {
    dbUser = await prisma.user.findUnique({
      where: { supabaseUserId: supabaseUser.id },
    });

    if (!dbUser) {
      const fullName =
        supabaseUser.user_metadata?.full_name ||
        supabaseUser.user_metadata?.fullName ||
        (supabaseUser.email ? supabaseUser.email.split("@")[0] : null);
      const avatarUrl =
        supabaseUser.user_metadata?.avatar_url ||
        supabaseUser.user_metadata?.avatarUrl ||
        null;

      try {
        dbUser = await prisma.user.create({
          data: {
            supabaseUserId: supabaseUser.id,
            email: supabaseUser.email,
            fullName,
            avatarUrl,
            role: "USER",
          },
        });
      } catch (createErr) {
        if (createErr.code === "P2002") {
          // Race condition: another request created the user concurrently
          dbUser = await prisma.user.findUnique({
            where: { supabaseUserId: supabaseUser.id },
          });
          if (!dbUser && supabaseUser.email) {
            dbUser = await prisma.user.findUnique({
              where: { email: supabaseUser.email },
            });
          }
        } else {
          throw createErr;
        }
      }
    }

    if (!dbUser) {
      throw new Error("Unable to establish user record in database.");
    }
  } catch (dbErr) {
    logger.error(`[Auth Middleware Database Error] ${dbErr.message}`);
    // Database errors return 503, never 401
    return next(
      new AppError(
        "Database service temporarily unavailable. Please try again shortly.",
        503,
        "DATABASE_UNAVAILABLE"
      )
    );
  }

  // 4. Cache verified user for 60 seconds
  const authPayload = {
    supabaseUserId: supabaseUser.id,
    email: supabaseUser.email,
    user: supabaseUser,
  };

  userCache.set(supabaseUser.id, {
    dbUser,
    auth: authPayload,
    expiresAt: now + CACHE_TTL_MS,
  });

  if (userCache.size > 200) {
    pruneExpiredCache();
  }

  req.user = dbUser;
  req.auth = authPayload;
  next();
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

export default { protect, restrictTo, clearUserCache };
