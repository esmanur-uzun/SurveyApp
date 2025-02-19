import APIError from "../@utils/error";
import { ErrorRequestHandler, Request, Response, NextFunction } from "express";

const errorHandlerMiddleware: ErrorRequestHandler = (
  err: Error | APIError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof APIError) {
    res.status(err.statusCode || 400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "API'de bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
  });
  return;
};

export default errorHandlerMiddleware;
