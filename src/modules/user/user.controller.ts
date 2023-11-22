import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { UserService } from './user.service.ts';
import { inject } from 'inversify';
import TYPES from '../../constant/types.ts';
import { Request } from 'express';

@controller('/api/v1/users')
export class UserController {
  constructor(@inject(TYPES.UserService) private userService: UserService) {}

  @httpGet('/')
  public getUsers() {
    return this.userService.getAllUsers();
  }

  @httpPost('/')
  public createUser(req: Request) {
    return this.userService.createUser(req.body);
  }
}
