import { injectable } from 'inversify';
import { User } from './user.model.ts';
import { IUser } from './user.interfaces.ts';

// export const getUserByEmail = async (
//   email: string,
// ): Promise<IUserDoc | null> => {
//   const user = await User.findOne({ email }).select('+password');
//   return user;
// };

@injectable()
export class UserService {
  public async getAllUsers() {
    return await User.find();
  }

  public async createUser(userBody: IUser) {
    const user = await User.create(userBody);
    //Remove password from output
    user.password = undefined;
    return user;
  }
}
