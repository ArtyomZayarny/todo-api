import { Document } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string | undefined;
  photo: string;
  role?: string;
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}
