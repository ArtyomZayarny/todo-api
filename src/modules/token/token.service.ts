import config from '../../config/config.ts';
import jwt from 'jsonwebtoken';
import { IUserDoc } from '../user/user.interfaces.ts';

export const generateToken = (user: IUserDoc) => {
  return jwt.sign({ id: user._id }, config.jwt.secret!, {
    expiresIn: config.jwt.expiresIn,
  });
};
