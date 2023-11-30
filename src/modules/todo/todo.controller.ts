import {
  controller,
  httpDelete,
  httpGet,
  httpPatch,
  httpPost,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import TYPES from '../../constant/types.ts';
import { TodoService } from './todo.service.ts';
import { Request } from 'express';
import { APIContainer } from '../../inversify.config.ts';
import * as express from 'express';
import { AppError } from '../errors/AppError.ts';
import httpStatus from 'http-status';

@controller(
  '/api/v1/todos',
  APIContainer.get<express.RequestHandler>('AuthMiddleware'),
)
export class TodoController {
  constructor(@inject(TYPES.TodoService) private todoService: TodoService) {}

  @httpGet('/')
  public getAllTodos() {
    return this.todoService.find();
  }

  @httpPost('/')
  public createTodo(req: Request) {
    return this.todoService.create(req.body);
  }

  @httpGet('/:id')
  public async getTodo(
    req: Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const { id } = req.params;
    const doc = await this.todoService.getOne(id);
    if (!doc) {
      return res.status(404).send({
        message: `Not doc found with that id = ${id}`,
      });
    }
    return doc;
  }

  @httpDelete('/:id')
  public deleteTodo(req: Request, next: express.NextFunction) {
    try {
      const { id } = req.params;
      return this.todoService.delete(id);
    } catch (error) {
      next(error);
    }
  }

  @httpPatch('/:id')
  public async updateTodo(req: Request, res: express.Response) {
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
