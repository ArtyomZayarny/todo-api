import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.ts';
import * as userService from '../user/user.service.ts';
import httpStatus from 'http-status';
import { tokenService } from '../token/index.ts';

export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //register user
    const user = await userService.createUser(req.body);
    //generate token
    const token = await tokenService.generateToken(user);
    //send user to client
    res.status(httpStatus.CREATED).send({ user, token });
  },
);

export const login = catchAsync(async (req: Request, res: Response) => {});
