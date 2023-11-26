import config from '../config/config.ts';
import jwt from 'jsonwebtoken';

export const signToken = (id: string) => {
  return jwt.sign({ id }, config.jwt.secret!, {
    expiresIn: config.jwt.expiresIn,
  });
};
