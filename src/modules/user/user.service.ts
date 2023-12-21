import { injectable } from 'inversify';
import { User } from './user.model.ts';
import { IUser } from './user.interfaces.ts';

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

  public async getUserByEmail(email: string) {
    return await User.findOne({ email }).select('+password');
  }

  public async getUserById(id: string) {
    return await User.findById(id);
  }

  public async delete(id: string) {
    return await User.findByIdAndDelete(id);
  }
}
