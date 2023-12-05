import config from '../config/config.ts';
import jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';

export const signToken = (id: mongoose.Types.ObjectId) => {
  return jwt.sign({ id }, config.jwt.secret!, {
    expiresIn: config.jwt.expiresIn,
  });
};
