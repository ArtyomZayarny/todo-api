import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import validator from 'validator';

import config from '../../config/config.ts';
import { IUser, IUserDoc } from './user.interfaces.ts';

const userSchema = new mongoose.Schema<IUserDoc>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide valid email'],
  },
  photo: { type: String, default: 'default.jpeg' },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    select: false,
    validate(value: string) {
      if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        throw new Error(
          'Password must contain at least one letter and one number',
        );
      }
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isEmailConfirmed: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password!, 8);
  }
  next();
});

userSchema.method(
  'isPasswordMatch',
  async function (password: string): Promise<boolean> {
    const user = this;
    return bcrypt.compare(password, user.password!);
  },
);

userSchema.method('createEmailConfirmationToken', async function (user: IUser) {
  // add verifyEmailToken expiration time (10 min)
  const expires = Date.now() + 10 * 60 * 1000;
  // generate token with expiration date
  const payload = {
    id: user._id,
    iat: Date.now(),
    exp: expires,
  };
  const verifyEmailToken = jwt.sign(payload, config.jwt.secret!);
  return verifyEmailToken;
});

export const User = mongoose.model<IUserDoc>('User', userSchema);
