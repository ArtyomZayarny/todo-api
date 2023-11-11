import mongoose from 'mongoose';
import config from './config/config.ts';
import { app } from './app.ts';

let server: any;

mongoose.connect(config.mongoose.url!).then(() => {
  console.log('DB connection successful!');
  server = app.listen(config.port, () => {
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
