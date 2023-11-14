import express, { Express, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
// @ts-ignore
import xss from 'xss-clean';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import { todoRouter } from './modules/todo/todo.route.ts';
import userRouter from './modules/user/user.route.ts';
import authRouter from './modules/auth/auth.route.ts';
import { errorHandler } from './modules/errors/errorHandler.ts';
import { AppError } from './modules/errors/AppError.ts';

const app: Express = express();

// set security HTTP headers
app.use(helmet());

// Development logging http request
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Parse json request body
app.use(express.json());

// sanitize request data
app.use(xss());
app.use(ExpressMongoSanitize());

// mountain's routing
app.use('/api/v1/todos', todoRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

export { app };
