import { inject } from 'inversify';
import TYPES from '../../constant/types.ts';
import {
  controller,
  httpGet,
  httpPost,
  queryParam,
  response,
} from 'inversify-express-utils';
import * as path from 'path';
import { UserService } from '../user/user.service.ts';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { signToken } from '../../utils/signToken.ts';
import { AppError } from '../errors/AppError.ts';
import { AuthService } from './auth.service.ts';
import { EmailService } from '../email/email.service.ts';

@controller('/api/v1/auth')
export class AuthController {
  constructor(
    @inject(TYPES.AuthService) private authService: AuthService,
    @inject(TYPES.UserService) private userService: UserService,
    @inject(TYPES.EmailService) private emailService: EmailService,
  ) {}

  @httpPost('/register')
  public async register(req: Request, res: Response) {
    //Create user
    const user = await this.userService.createUser(req.body);

    //Generate token
    const token = signToken(user._id);
    // await user.createEmailConfirmationToken(user);
    const emailConfirmationToken =
      await user.createEmailConfirmationToken(user);

    try {
      await this.emailService.sendVerificationEmail(
        user.email,
        emailConfirmationToken!,
        user.name,
      );
    } catch (err) {
      console.log(err);
    }

    //send user to client
    res.status(httpStatus.OK).send({ user, token });
  }

  @httpPost('/login')
  public async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    // 1 Check if email  and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password !', 400));
    }
    const user = await this.authService.loginUserWithEmailAndPassword(
      email,
      password,
    );

    const token = signToken(user._id);
    res.status(httpStatus.OK).send({ user, token });
  }

  @httpGet('/verify-email')
  public async verifyEmail(
    @response() res: Response,
    @queryParam() params: { token: string },
  ) {
    const { token } = params;
    await this.authService.verifyEmail(token);
    res.render(
      path.resolve(__dirname, '../../views/email-verification-success.ejs'),
    );
  }
}
