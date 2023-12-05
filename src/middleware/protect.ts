import { NextFunction, Request, Response } from 'express';
import { AppError } from '../modules/errors/AppError.ts';
import jwt from 'jsonwebtoken';
import config from '../config/config.ts';
import { User } from '../modules/user/user.model.ts';

export interface JwtPayload {
  id: string;
}

export async function JwtProtect(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Getting token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401),
    );
  }

  // Verification token
  const decoded = (await jwt.verify(token, config.jwt.secret!)) as JwtPayload;

  // Check if user still exist
  const user = await User.findById(decoded.id);
  if (!user)
    return next(
      new AppError('The user belonging to this token no longer exist', 401),
    );

  //@ts-ignore
  req.user = user;
  next();
}
