import { Container } from 'inversify';
import * as express from 'express';
import { UserService } from './modules/user/user.service.ts';
import TYPES from './constant/types.ts';
import { TodoService } from './modules/todo/todo.service.ts';
import { AuthService } from './modules/auth/auth.service.ts';
import { JwtProtect } from './middleware/protect.ts';
import { EmailService } from './modules/email/email.service.ts';

const APIContainer = new Container();
APIContainer.bind<UserService>(TYPES.UserService).to(UserService);
APIContainer.bind<TodoService>(TYPES.TodoService).to(TodoService);
APIContainer.bind<AuthService>(TYPES.AuthService).to(AuthService);
APIContainer.bind<EmailService>(TYPES.EmailService).to(EmailService);

//Auth middleware
APIContainer.bind<express.RequestHandler>('AuthMiddleware').toConstantValue(
  JwtProtect,
);

export { APIContainer };
