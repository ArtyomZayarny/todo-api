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
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  email: {
    smtp: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    },
    from: process.env.EMAIL_FROM,
  },
  clientUrl: process.env.CLIENT_URL,
  aws: {
    s3: {
      bucketName: process.env.AWS_BUCKET_NAME,
      region: process.env.AWS_BUCKET_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
  },
};

export default config;
