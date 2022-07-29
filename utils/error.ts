import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleNotFound = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  next(new AppError(`Url: ${req.originalUrl} is not found!`, 404));
};

export const methodNotAllowed = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  next(new AppError(`Method ${req.method} is not allowed on this url`, 405));
};

export const handleError = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(err);

  err.statusCode = err.statusCode || 500;

  err.message =
    err instanceof AppError ? err.message : 'Sorry, please try again later.';

  res.status(err.statusCode).json({
    message: err.message,
  });

  next();
};