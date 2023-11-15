import { NextFunction, Request, Response } from 'express';
import { AppError } from './AppError.ts';

const handleCastErrorDb = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err: any) => {
  const message = `Duplicate field value:${JSON.stringify(
    err.keyValue,
  )}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDb = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProduction = (err: any, res: Response) => {
  // OPerational error, trusted errors: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1 log Error
    console.error('ERROR  🐸 ', err);

    // 2 send generic error
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

const handleJWTError = () => new AppError('Invalid token please login', 404);

const handleExpiredToken = () =>
  new AppError('Token expired, Please log in again', 401);

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorDb(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDb(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleExpiredToken();
    sendErrorProduction(error, res);
  }
};
