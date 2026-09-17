import AppError from "../utils/AppError.js";

export const notFoundHandler = (req, res, next) => {
  next(new AppError(`Resource not found: ${req.originalUrl}`, 404, "NOT_FOUND"));
};

export default notFoundHandler;
