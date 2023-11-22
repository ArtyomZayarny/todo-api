import httpStatus from 'http-status';
import { getUserByEmail } from '../user/user.service.ts';
import { AppError } from '../errors/AppError.ts';
import { IUserDoc } from '../user/user.interfaces.ts';

export const loginUserWithEmailAndPassword = async (
  email: string,
  password: string,
): Promise<IUserDoc> => {
  const user = await getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new AppError('Incorrect email or password', httpStatus.UNAUTHORIZED);
  }
  user.password = undefined;
  return user;
};
