import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.ts';
import * as userService from '../user/user.service.ts';
import httpStatus from 'http-status';
import config from '../../config/config.ts';
import jwt from 'jsonwebtoken';
import * as authService from './auth.service.ts';
import { AppError } from '../errors/AppError.ts';

export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //register user
    const user = await userService.createUser(req.body);
    //send user to client
    res.status(httpStatus.CREATED).send({ user });
  },
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // 1 Check if email  and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password !', 400));
    }

    const user = await authService.loginUserWithEmailAndPassword(
      email,
      password,
    );

    const token = jwt.sign({ id: user._id }, config.jwt.secret!, {
      expiresIn: config.jwt.expiresIn,
    });

    res.status(httpStatus.CREATED).send({ user, token });
  },
);
