import app from "./src/app.js";
import env from "./src/config/env.js";
import logger from "./src/utils/logger.js";

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running in [${env.NODE_ENV}] mode on port ${PORT}`);
  logger.info(`🔗 Health check available at http://localhost:${PORT}/health`);
});

// Process Rejection Handlers
process.on("unhandledRejection", (err) => {
  logger.error("💥 UNHANDLED REJECTION! Shutting down gracefully...");
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  logger.error("💥 UNCAUGHT EXCEPTION! Shutting down gracefully...");
  logger.error(err.name, err.message);
  process.exit(1);
});
