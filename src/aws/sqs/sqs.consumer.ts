// eslint-disable-next-line node/no-extraneous-import
import { SQSClient } from '@aws-sdk/client-sqs';
import { Consumer } from 'sqs-consumer';

import config from '../../config/config.ts';
import { EmailService } from '../../modules/email/email.service.ts';

const emailService = new EmailService();

const queueUrl = config.aws.sqs.url!;
export const SqsListener = Consumer.create({
  queueUrl: queueUrl,
  handleMessage: async (message) => {
    const { email, token, username } = JSON.parse(message.Body!);
    try {
      emailService.sendVerificationEmail(email, token, username);
    } catch (err) {
      console.log(err);
    }
  },
  sqs: new SQSClient({
    region: config.aws.sqs.region!,
    credentials: {
      accessKeyId: config.aws.s3.accessKeyId!,
      secretAccessKey: config.aws.s3.secretAccessKey!,
    },
  }),
});

SqsListener.on('error', (err) => {
  console.error(err.message);
});

SqsListener.on('processing_error', (err) => {
  console.error(err.message);
});
