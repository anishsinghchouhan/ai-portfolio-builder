import logger from "../utils/logger.js";

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.errorCode = err.errorCode || "INTERNAL_SERVER_ERROR";

  logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  if (err.stack && process.env.NODE_ENV === "development") {
    logger.error(err.stack);
  }

  res.status(err.statusCode).json({
    success: false,
    statusCode: err.statusCode,
    error: {
      code: err.errorCode,
      message: err.message,
      details: err.details || null,
    },
    timestamp: new Date().toISOString(),
  });
};

export default globalErrorHandler;
