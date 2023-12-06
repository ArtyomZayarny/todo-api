import nodemailer, { TransportOptions } from 'nodemailer';
import config from '../config/config.ts';
import { catchAsync } from './catchAsync.ts';

export const transport = nodemailer.createTransport(
  config.email.smtp as TransportOptions,
);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => console.log('Connected to email server'))
    .catch(() =>
      console.warn(
        'Unable to connect to email server. Make sure you have configured the SMTP options in .env',
      ),
    );
}

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string,
): Promise<void> => {
  const msg = {
    from: config.email.from,
    to,
    subject,
    text,
    html,
  };
  await transport.sendMail(msg);
};

export const sendVerificationEmail = catchAsync(
  async (to: string, token: string, name: string): Promise<void> => {
    const subject = 'Email Verification';
    // replace this url with the link to the email verification page of your front-end app
    const verificationEmailUrl = `http://${config.clientUrl}/verify-email?token=${token}`;
    const text = `Hi ${name},
    To verify your email, click on this link: ${verificationEmailUrl}
    If you did not create an account, then ignore this email.`;
    const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
    <p>To verify your email, click on this link: ${verificationEmailUrl}</p>
    <p>If you did not create an account, then ignore this email.</p></div>`;
    await sendEmail(to, subject, text, html);
  },
);
