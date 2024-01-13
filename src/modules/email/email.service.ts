import * as ejs from 'ejs';
import { injectable } from 'inversify';
import nodemailer, { TransportOptions } from 'nodemailer';
import * as path from 'path';

import config from '../../config/config.ts';

export const transport = nodemailer.createTransport(
  config.email.smtp as TransportOptions,
);

@injectable()
export class EmailService {
  public async sendEmail(to: string, subject: string, html: string) {
    const msg = {
      from: config.email.from,
      to,
      subject,
      html,
    };
    await transport.sendMail(msg);
  }

  public async sendVerificationEmail(to: string, token: string, name: string) {
    const subject = 'Email Verification';
    // replace this url with the link to the email verification page of your front-end app
    const verificationEmailUrl = `http://${config.clientUrl}/api/v1/auth/verify-email?token=${token}`;

    const html = await ejs.renderFile(
      path.resolve(__dirname, '../../../src/views/email-verification.ejs'),
      {
        name,
        verificationEmailUrl,
      },
    );

    await this.sendEmail(to, subject, html);
  }
}
