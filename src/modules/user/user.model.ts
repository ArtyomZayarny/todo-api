import mongoose from 'mongoose';
import validator from 'validator';

interface IUser {
  name: string;
  email: string;
  photo: string;
  password: string;
  role: string;
}

const userSchema = new mongoose.Schema<IUser>({
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
});

export const User = mongoose.model<IUser>('User', userSchema);
