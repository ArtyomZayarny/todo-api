import mongoose from 'mongoose';
import dotenv from 'dotenv';

process.on('unhandledRejection', (err: Error) => {
  console.log('unhandledRejection', err?.name, err?.message);
  console.log('unhandledRejection 🎆');

  process.exit(1);
});
process.on('uncaughtException', (err: Error) => {
  console.log('uncaughtException', err.name, err.message);
  console.log('uncaughtException 🎆');

  process.exit(1);
});

dotenv.config({ path: '.env' });

import { Error } from 'mongoose';
import { app } from './app.ts';

const DB = process?.env?.MONGO_DB_CONNECT?.replace(
  '<password>',
  process?.env?.MONGO_DB_PASSWORD || '',
);

mongoose.connect(DB!).then(() => {
  console.log('DB connection successful!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
