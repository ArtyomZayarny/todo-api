import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';

export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: Error) => next(err));
  };
};
