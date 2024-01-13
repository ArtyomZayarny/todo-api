import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import { inject } from 'inversify';
import {
  controller,
  httpDelete,
  httpGet,
  httpPatch,
  httpPost,
} from 'inversify-express-utils';
import util from 'util';

import { uploadToS3 } from '../../aws/s3/index.ts';
import TYPES from '../../constant/types.ts';
import { AuthGuard } from '../../middleware/auth.guard.ts';
import { isAdmin } from '../../middleware/role.guard.ts';
import { uploadPhoto } from '../../middleware/uploadPhoto.ts';
import { redisCheckName, redisSet } from '../../redis/index.ts';
import { TodoService } from './todo.service.ts';
const unlinkFile = util.promisify(fs.unlink);

@controller('/api/v1/todos', AuthGuard())
export class TodoController {
  constructor(@inject(TYPES.TodoService) private todoService: TodoService) {}
  //Get user's todos
  @httpGet('/user')
  public async userTodos(req: Request) {
    //@ts-ignore
    const { _id } = req.user;
    let userTodos = await redisCheckName('userTodos');

    if (!!userTodos) {
      return JSON.parse(userTodos);
    } else {
      const result = await this.todoService.filterTodo({ userId: _id });
      await redisSet('userTodos', JSON.stringify(result));
      return result;
    }
  }

  @httpGet('/')
  public async getAllTodos(next: NextFunction) {
    try {
      const doc = await this.todoService.find();
      return {
        result: doc.length,
        todos: doc,
      };
    } catch (error) {
      next(error);
    }
  }

  @httpPost('/', uploadPhoto())
  public async createTodo(req: Request) {
    let file;
    if (req.file) {
      //@ts-ignore
      file = await uploadToS3(req.file);
      //@ts-ignore
      await unlinkFile(req.file.path);
    }
    return this.todoService.create({
      ...req.body,
      //@ts-ignores
      userId: req.user._id,
      image: `/images/${file!.Key}`,
    });
  }

  @httpGet('/:id')
  public async getTodo(req: Request, res: Response) {
    const { id } = req.params;
    const doc = await this.todoService.getOne(id);
    if (!doc) {
      return res.status(404).send({
        message: `Not doc found with that id = ${id}`,
      });
    }
    return doc;
  }

  @httpDelete('/:id', isAdmin())
  public async deleteTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const doc = await this.todoService.delete(id);
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

  @httpPatch('/:id')
  public async updateTodo(req: Request, res: Response) {
    const { id } = req.params;
    const doc = await this.todoService.update(id, req.body);
    if (!doc) {
      return res.status(404).send({
        message: `Not doc found with that id = ${id}`,
      });
    }
    return doc;
  }
}
