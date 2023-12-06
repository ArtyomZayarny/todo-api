import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import config from '../../config/config.ts';
import { IUser } from '../user/user.interfaces.ts';
import nodemailer, { TransportOptions } from 'nodemailer';

export const transport = nodemailer.createTransport(
  config.email.smtp as TransportOptions,
);

@injectable()
export class EmailService {
  public async createEmailConfirmationToken(user: IUser) {
    // add verifyEmailToken expiration time (10 min)
    const expires = Date.now() + 10 * 60 * 1000;
    // generate token with expiration date
    const payload = {
      id: user._id,
      iat: Date.now(),
      exp: expires,
    };
    const verifyEmailToken = jwt.sign(payload, config.jwt.secret!);
    return verifyEmailToken;
  }

  public async sendEmail(
    to: string,
    subject: string,
    text: string,
    html: string,
  ) {
    const msg = {
      from: config.email.from,
      to,
      subject,
      text,
      html,
    };
    await transport.sendMail(msg);
  }

  public async sendVerificationEmail(to: string, token: string, name: string) {
    const subject = 'Email Verification';
    // replace this url with the link to the email verification page of your front-end app
    const verificationEmailUrl = `http://${config.clientUrl}/verify-email?token=${token}`;
    const text = `Hi ${name},
    To verify your email, click on this link: ${verificationEmailUrl}
    If you did not create an account, then ignore this email.`;
    const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
    <p>To verify your email, click on this link: ${verificationEmailUrl}</p>
    <p>If you did not create an account, then ignore this email.</p></div>`;
    await this.sendEmail(to, subject, text, html);
  }
}