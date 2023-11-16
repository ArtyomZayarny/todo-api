import { IUser, IUserDoc } from './user.interfaces.ts';
import { User } from './user.model.ts';

export const createUser = async (userBody: IUser): Promise<IUserDoc> => {
  const user = await User.create(userBody);
  //Remove password from output
  user.password = undefined;
  return user;
};

export const getAllUsers = async () => {
  return User.find();
};

export const getUserByEmail = async (
  email: string,
): Promise<IUserDoc | null> => {
  const user = await User.findOne({ email }).select('+password');
  return user;
};
