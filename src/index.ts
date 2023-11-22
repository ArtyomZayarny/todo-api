import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
// @ts-ignore
import xss from 'xss-clean';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import { errorHandler } from './modules/errors/errorHandler.ts';
import { AppError } from './modules/errors/AppError.ts';

import mongoose from 'mongoose';
import config from './config/config.ts';
import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Container } from 'inversify';
import { UserService } from './modules/user/user.service.ts';
import './modules/user/user.controller.ts';
import TYPES from './constant/types.ts';

let server: any;

mongoose.connect(config.mongoose.url!).then(() => {
  console.log('DB connection successful!');

  const container = new Container();

  container.bind<UserService>(TYPES.UserService).to(UserService);

  server = new InversifyExpressServer(container);
  server.setConfig((app: any) => {
    app.use(express.json());
    app.use(helmet());

    // Development logging http request
    if (process.env.NODE_ENV === 'development') {
      app.use(morgan('dev'));
    }

    // // Parse json request body
    app.use(express.json());

    // // sanitize request data
    app.use(xss());
    app.use(ExpressMongoSanitize());

    app.use(errorHandler);
  });
  const app = server.build();
  app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: string) => {
  console.log(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close();
  }
});
