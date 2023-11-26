import { Container } from 'inversify';
import { UserService } from './modules/user/user.service.ts';
import TYPES from './constant/types.ts';
import { TodoService } from './modules/todo/todo.service.ts';
import { AuthService } from './modules/auth/auth.service.ts';

const APIContainer = new Container();
APIContainer.bind<UserService>(TYPES.UserService).to(UserService);
APIContainer.bind<TodoService>(TYPES.TodoService).to(TodoService);
APIContainer.bind<AuthService>(TYPES.AuthService).to(AuthService);

//APIContainer.bind<UserService>(TYPES.UserService).to(AuthService);

export { APIContainer };
