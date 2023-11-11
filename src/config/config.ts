import 'dotenv/config';

const config = {
  env: 'development',
  port: process.env.PORT || 3000,
  mongoose: {
    url: process?.env?.MONGO_DB_CONNECT?.replace(
      '<password>',
      process?.env?.MONGO_DB_PASSWORD || '',
    ),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};

export default config;
