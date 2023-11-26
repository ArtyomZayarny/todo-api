import httpStatus from 'http-status';
import { UserService } from '../user/user.service.ts';
import { AppError } from '../errors/AppError.ts';
import { inject, injectable } from 'inversify';
import TYPES from '../../constant/types.ts';

@injectable()
export class AuthService {
  constructor(@inject(TYPES.UserService) private userService: UserService) {}

  public async loginUserWithEmailAndPassword(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new AppError(
        'Incorrect email or password',
        httpStatus.UNAUTHORIZED,
      );
    }
    user.password = undefined;
    return user;
  }
}
