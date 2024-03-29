import httpStatus from 'http-status';
import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';

import config from '../../config/config.ts';
import TYPES from '../../constant/types.ts';
import { JwtPayload } from '../../middleware/auth.guard.ts';
import { AppError } from '../errors/AppError.ts';
import { UserService } from '../user/user.service.ts';

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

  public async verifyEmail(token: string) {
    try {
      // Verification token
      const decoded = (await jwt.verify(
        token,
        config.jwt.secret!,
      )) as JwtPayload;
      // Check if user still exist
      const user = await this.userService.getUserById(decoded.id);
      if (user) {
        user.isEmailConfirmed = true;
        await user.save();
      }
    } catch (error) {
      //invalid token TODO
      console.log('error', error);
      // throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
    }
  }
}
