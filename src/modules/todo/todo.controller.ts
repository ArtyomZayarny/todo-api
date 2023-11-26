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

@controller('/api/v1/todos')
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
  public getTodo(req: Request) {
    const { id } = req.params;
    return this.todoService.getOne(id);
  }

  @httpDelete('/:id')
  public deleteTodo(req: Request) {
    const { id } = req.params;
    return this.todoService.delete(id);
  }

  @httpPatch('/:id')
  public updateTodo(req: Request) {
    const { id } = req.params;
    return this.todoService.update(id, req.body);
  }
}
