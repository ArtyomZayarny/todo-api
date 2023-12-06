import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string | undefined;
  photo: string;
  role?: string;
  isEmailConfirmed: boolean;
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
  createEmailConfirmationToken: (user: IUser) => void;
}
