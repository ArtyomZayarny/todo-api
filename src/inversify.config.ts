import { Container } from 'inversify';
import * as express from 'express';
import { UserService } from './modules/user/user.service.ts';
import TYPES from './constant/types.ts';
import { TodoService } from './modules/todo/todo.service.ts';
import { AuthService } from './modules/auth/auth.service.ts';
import { AuthGuard } from './middleware/auth.guard.ts';
import { EmailService } from './modules/email/email.service.ts';
import { isAdmin } from './middleware/role.guard.ts';
import { RabbitMQService } from './rabbitmq/rabbitmq.service.ts';

const APIContainer = new Container();
APIContainer.bind<UserService>(TYPES.UserService).to(UserService);
APIContainer.bind<TodoService>(TYPES.TodoService).to(TodoService);
APIContainer.bind<AuthService>(TYPES.AuthService).to(AuthService);
APIContainer.bind<EmailService>(TYPES.EmailService).to(EmailService);
APIContainer.bind<RabbitMQService>(TYPES.RabbitMQService).to(RabbitMQService);

//Auth middleware
APIContainer.bind<express.RequestHandler>('AuthMiddleware').toConstantValue(
  AuthGuard,
);
APIContainer.bind<express.RequestHandler>('isAdmin').toConstantValue(isAdmin);

export { APIContainer };
