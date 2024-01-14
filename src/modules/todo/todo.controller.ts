import { unlink } from 'node:fs/promises';

import { NextFunction, Request, Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpDelete,
  httpGet,
  httpPatch,
  httpPost,
} from 'inversify-express-utils';

import { S3Service } from '../../aws/s3/S3.service.ts';
import TYPES from '../../constant/types.ts';
import { AuthGuard } from '../../middleware/auth.guard.ts';
import { isAdmin } from '../../middleware/role.guard.ts';
import { uploadPhoto } from '../../middleware/uploadPhoto.ts';
import { RedisService } from '../../redis/redis.service.ts';
import { TodoService } from './todo.service.ts';

@controller('/api/v1/todos', AuthGuard())
export class TodoController {
  constructor(
    @inject(TYPES.TodoService) private todoService: TodoService,
    @inject(TYPES.RedisService) private redisService: RedisService,
    @inject(TYPES.S3Service) private s3Service: S3Service,
  ) {}
  //Get user's todos
  @httpGet('/user')
  public async userTodos(req: Request) {
    //@ts-ignore
    const { _id } = req.user;
    let userTodos = await this.redisService.getName(`${_id}`);

    if (!!userTodos) {
      return JSON.parse(userTodos);
    } else {
      const result = await this.todoService.filterTodo({ userId: _id });
      await this.redisService.setData(`${_id}`, JSON.stringify(result));
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
      file = await this.s3Service.uploadImage(req.file);
      //@ts-ignore
      await unlink(req.file.path);
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
