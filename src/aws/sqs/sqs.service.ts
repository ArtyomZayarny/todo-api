import { SQS } from 'aws-sdk';
import { injectable } from 'inversify';

import config from '../../config/config.ts';

@injectable()
export class SqsService {
  private sqs: SQS;

  constructor() {
    this.sqs = new SQS({
      region: config.aws.sqs.region,
      accessKeyId: config.aws.s3.accessKeyId,
      secretAccessKey: config.aws.s3.secretAccessKey,
    });
  }

  async sendEmailConfirmation(email: string, token: string, username: string) {
    const queueUrl = config.aws.sqs.url!;

    const params: SQS.SendMessageRequest = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify({ email, token, username }),
    };

    await this.sqs.sendMessage(params).promise();
  }
}
