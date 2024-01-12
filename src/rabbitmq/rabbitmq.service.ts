import * as amqp from 'amqplib';
import { injectable } from 'inversify';
import config from '../config/config.ts';

@injectable()
export class RabbitMQService {
  private connection!: amqp.Connection;
  private channel!: amqp.Channel;

  constructor() {
    this.connect();
  }

  async connect() {
    this.connection = await amqp.connect(config.rabbitMQ.url!);
    this.channel = await this.connection.createChannel();
  }

  async sendEmailConfiramtion(email: string, token: string, userName: string) {
    const queue = config.rabbitMQ.queueName!;
    const message = { email, token, userName };

    if (!this.channel) {
      await this.connect();
    }

    await this.channel.assertQueue(queue, { durable: true });
    await this.channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
    );
  }
}
