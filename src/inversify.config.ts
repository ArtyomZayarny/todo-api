import * as express from 'express';
import { Container } from 'inversify';

import TYPES from './constant/types.ts';
import { AuthGuard } from './middleware/auth.guard.ts';
import { isAdmin } from './middleware/role.guard.ts';
import { AuthService } from './modules/auth/auth.service.ts';
import { EmailService } from './modules/email/email.service.ts';
import { TodoService } from './modules/todo/todo.service.ts';
import { UserService } from './modules/user/user.service.ts';
import { RabbitMQService } from './rabbitmq/rabbitmq.service.ts';
import { RedisService } from './redis/redis.service.ts';

const APIContainer = new Container();
APIContainer.bind<UserService>(TYPES.UserService).to(UserService);
APIContainer.bind<TodoService>(TYPES.TodoService).to(TodoService);
APIContainer.bind<AuthService>(TYPES.AuthService).to(AuthService);
APIContainer.bind<EmailService>(TYPES.EmailService).to(EmailService);
APIContainer.bind<RabbitMQService>(TYPES.RabbitMQService).to(RabbitMQService);
APIContainer.bind<RedisService>(TYPES.RedisService)
  .to(RedisService)
  .inSingletonScope();

//Auth middleware
APIContainer.bind<express.RequestHandler>('AuthMiddleware').toConstantValue(
  AuthGuard,
);
APIContainer.bind<express.RequestHandler>('isAdmin').toConstantValue(isAdmin);

export { APIContainer };
