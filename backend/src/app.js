import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import env from "./config/env.js";
import AppError from "./utils/AppError.js";
import globalErrorHandler from "./middleware/errorHandler.js";
import notFoundHandler from "./middleware/notFoundHandler.js";
import { globalLimiter, authLimiter } from "./middleware/rateLimiter.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();

// 1. Trust proxy for rate limiting behind reverse proxies (Render, Railway, Vercel, Nginx)
app.set("trust proxy", 1);

// 2. Enhanced Helmet Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", env.CORS_ORIGIN, "https://*.supabase.co"],
        imgSrc: ["'self'", "data:", "https:"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
  })
);

// 3. Health Check Endpoint (Placed BEFORE CORS so monitoring/probes are never blocked)
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Portfolio Builder API Server Operating Normally",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// 4. Strict Whitelist CORS Configuration (Only allowed frontend URL from .env)


const allowedOrigins = [env.CORS_ORIGIN]
  .filter(Boolean)
  .map((origin) => origin.trim().replace(/\/$/, ""));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without Origin (health checks, curl, server-to-server).
      // These requests still need normal authentication/authorization.
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.trim().replace(/\/$/, "");

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(
        new AppError(
          `CORS Blocked: Origin '${origin}' is not authorized.`,
          403,
          "CORS_FORBIDDEN"
        )
      );
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  })
);


// 5. Body Parsers with 1MB payload limits (prevents payload bloat / DoS)
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// 6. Request Logging in development
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// 7. Global API Rate Limiter (300 requests per 15 minutes)
app.use("/api", globalLimiter);

// 8. API v1 Routes (Auth routes guarded with strict authLimiter: 10 per 15 min)
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/portfolios", portfolioRoutes);
app.use("/api/v1/public", publicRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// 9. 404 Route Not Found Middleware
app.use(notFoundHandler);

// 10. Global Central Error Handler Middleware
app.use(globalErrorHandler);

export default app;
