import logger from "../utils/logger.js";
import env from "../config/env.js";

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.errorCode = err.errorCode || "INTERNAL_SERVER_ERROR";

  // Always log the full technical error and stack trace to the private server logger
  logger.error(
    `${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );
  if (err.stack) {
    logger.error(err.stack);
  }

  // Determine client-safe error message (never leak internal 500 details in production)
  const isProduction = env.NODE_ENV === "production";
  const clientMessage =
    isProduction && err.statusCode === 500
      ? "An unexpected internal server error occurred. Please contact support."
      : err.message;

  // err.stack is strictly never sent in the response body to any client
  res.status(err.statusCode).json({
    success: false,
    statusCode: err.statusCode,
    error: {
      code: err.errorCode,
      message: clientMessage,
      details: isProduction ? null : err.details || null,
    },
    timestamp: new Date().toISOString(),
  });
};

export default globalErrorHandler;
