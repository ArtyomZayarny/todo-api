import * as amqp from 'amqplib';
import { EmailService } from '../modules/email/email.service.ts';
import config from '../config/config.ts';

export const rabbitmqConsumer = async () => {
  const connection = await amqp.connect(config.rabbitMQ.url!);
  const channel = await connection.createChannel();
  const queue = config.rabbitMQ.queueName!;

  await channel.assertQueue(queue, { durable: true });

  const emailService = new EmailService();

  channel.consume(
    queue,
    (message: any) => {
      const { email, token, username } = JSON.parse(message.content.toString());
      try {
        emailService.sendVerificationEmail(email, token, username);
      } catch (err) {
        console.log(err);
      }
    },
    { noAck: true },
  );
};
