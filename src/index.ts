import express from 'express';
import helmet from 'helmet';
// @ts-ignore
import xss from 'xss-clean';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import { errorHandler } from './modules/errors/errorHandler.ts';

import mongoose from 'mongoose';
import config from './config/config.ts';
import 'reflect-metadata'; // eslint-disable-line
import { InversifyExpressServer } from 'inversify-express-utils';
import './modules/user/user.controller.ts';
import './modules/todo/todo.controller.ts';
import './modules/auth/auth.controller.ts';
import { APIContainer } from './inversify.config.ts';
import { bucketName, s3 } from './aws/s3/index.ts';
import { rabbitmqConsumer } from './rabbitmq/rabbitmq.consumer.ts';

let server: any;
rabbitmqConsumer();

mongoose.connect(config.mongoose.url!).then(() => {
  console.log('DB connection successful!');

  server = new InversifyExpressServer(APIContainer);
  server.setConfig((app: any) => {
    app.set('view engine', 'ejs');
    app.use(express.json());
    app.use(helmet());

    // Development logging http request
    if (process.env.NODE_ENV === 'development') {
      app.use(morgan('dev'));
    }

    // // Parse json request body
    app.use(express.json());

    // Get image from s3 by key
    app.get('/images/:key', async (req: Request, res: any) => {
      //@ts-ignore
      const { key } = req.params;
      const params: any = { Bucket: bucketName, Key: key };
      s3.getObject(params, function (err, data) {
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.write(data.Body, 'binary');
        res.end(null, 'binary');
      });
    });

    // sanitize request data
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
