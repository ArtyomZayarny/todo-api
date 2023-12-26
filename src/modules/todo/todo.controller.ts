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
import { Request, Response, NextFunction } from 'express';
import { isAdmin } from '../../middleware/role.guard.ts';
import { AuthGuard } from '../../middleware/auth.guard.ts';

@controller('/api/v1/todos', AuthGuard())
export class TodoController {
  constructor(@inject(TYPES.TodoService) private todoService: TodoService) {}
  //Get user's todos
  @httpGet('/user')
  public async userTodos(req: Request) {
    //@ts-ignore
    const { _id } = req.user;
    return await this.todoService.filterTodo({ userId: _id });
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

  @httpPost('/')
  public createTodo(req: Request) {
    //@ts-ignore
    return this.todoService.create({ ...req.body, userId: req.user._id });
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
