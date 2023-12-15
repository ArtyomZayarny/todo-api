import { NextFunction, Request, Response } from 'express';
import { Roles } from '../constant/role.enum.ts';
import { AppError } from '../modules/errors/AppError.ts';

export const isAdmin = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    if (req.user.role !== Roles.Admin) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};
