import rateLimit from "express-rate-limit";

// Helper to create consistent rate limiters with standardized error responses
const createLimiter = ({ windowMs, max, message, errorCode }) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true, // Returns modern standard RateLimit-* headers
    legacyHeaders: false,   // Disables legacy X-RateLimit-* headers
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        statusCode: 429,
        error: {
          code: errorCode,
          message,
        },
        timestamp: new Date().toISOString(),
      });
    },
  });
};

// 1. Global API Protection: 300 requests per 15 minutes per IP
export const globalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: "Too many requests from this IP. Please try again after 15 minutes.",
  errorCode: "TOO_MANY_REQUESTS",
});

// 2. Strict Authentication Protection: 10 attempts per 15 minutes per IP
export const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many authentication attempts from this IP. Please try again after 15 minutes.",
  errorCode: "AUTH_RATE_LIMIT_EXCEEDED",
});

// 3. Strict AI Operations Protection: 5 generation requests per 15 minutes per IP
export const aiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "AI generation rate limit exceeded for this IP. Please try again after 15 minutes.",
  errorCode: "AI_RATE_LIMIT_EXCEEDED",
});

// 4. Dashboard Summary Protection: 120 requests per 15 minutes per IP
export const dashboardLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 120,
  message: "Too many dashboard requests from this IP. Please try again after 15 minutes.",
  errorCode: "DASHBOARD_RATE_LIMIT_EXCEEDED",
});

export default {
  globalLimiter,
  authLimiter,
  aiLimiter,
  dashboardLimiter,
};
