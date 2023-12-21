import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
} from 'inversify-express-utils';
import { UserService } from './user.service.ts';
import { inject } from 'inversify';
import TYPES from '../../constant/types.ts';
import { NextFunction, Request, Response } from 'express';
import { isAdmin } from '../../middleware/role.guard.ts';
import { AuthGuard } from '../../middleware/auth.guard.ts';

@controller('/api/v1/users')
export class UserController {
  constructor(@inject(TYPES.UserService) private userService: UserService) {} // eslint-disable-line

  @httpGet('/')
  public async getUsers(res: Response, next: NextFunction) {
    try {
      const doc = await this.userService.getAllUsers();
      return {
        result: doc.length,
        users: doc,
      };
    } catch (error) {
      next(error);
    }
  }

  @httpPost('/')
  public createUser(req: Request) {
    return this.userService.createUser(req.body);
  }

  @httpDelete('/:id', AuthGuard(), isAdmin())
  public async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      let doc;
      //@ts-ignore
      if (req.user.id !== id && user.role !== 'admin') {
        doc = await this.userService.delete(id);
      } else {
        return res.status(400).send({
          message: `You can't remove user with id = ${id}`,
        });
      }
      if (!doc) {
        return res.status(404).send({
          message: `Not doc found with that id = ${id}`,
        });
      }
      return doc;
    } catch (error) {
      next(error);
    }
  }
}
