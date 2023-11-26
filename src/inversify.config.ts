import { Container } from 'inversify';
import { UserService } from './modules/user/user.service.ts';
import TYPES from './constant/types.ts';
import { TodoService } from './modules/todo/todo.service.ts';

const APIContainer = new Container();
APIContainer.bind<UserService>(TYPES.UserService).to(UserService);
APIContainer.bind<TodoService>(TYPES.TodoService).to(TodoService);

export { APIContainer };
