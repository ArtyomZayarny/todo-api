import express, { Express } from 'express';
import helmet from 'helmet';
// @ts-ignore
import xss from 'xss-clean';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import { todoRouter } from './routes/todoRoutes.ts';

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

// Mountaining routing
app.use('/api/v1/todos', todoRouter);

export { app };
