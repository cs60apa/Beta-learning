import ErrorHandler from "../utils/ErrorHandler";
module.exports = (err: ErrorHandler, req: any, res: any, next: any) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
}   









