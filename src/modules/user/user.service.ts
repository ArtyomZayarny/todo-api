import { IUser } from './user.interfaces.ts';
import { User } from './user.model.ts';

export const createUser = async (userBody: IUser): Promise<IUser> => {
  return User.create(userBody);
};

export const getAllUsers = async () => {
  return User.find();
};
