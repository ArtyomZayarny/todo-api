//user controller
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import * as userService from './user.service.ts';
import { catchAsync } from '../../utils/catchAsync.ts';

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.status(httpStatus.OK).send(users);
});
