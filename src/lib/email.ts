import nodemailer from 'nodemailer';
import { emailTemplates } from './email-templates';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

interface TemplateEmailOptions {
  to: string;
  template: 'welcome' | 'passwordReset' | 'passwordResetConfirmation' | 'loginNotification';
  data: any;
  companyLogoUrl?: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send a basic email with provided content
 */
export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  const mailOptions = {
    from: `"Indkan Christmas Tree Store" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email.');
  }
}

/**
 * Send an email using a predefined template
 */
export async function sendTemplatedEmail({ to, template, data, companyLogoUrl }: TemplateEmailOptions) {
  let templateData: any;
  
  switch (template) {
    case 'welcome':
      templateData = emailTemplates.welcome(data.name, data.loginUrl, companyLogoUrl);
      break;
    case 'passwordReset':
      templateData = emailTemplates.passwordReset(data.name, data.resetUrl, companyLogoUrl);
      break;
    case 'passwordResetConfirmation':
      templateData = emailTemplates.passwordResetConfirmation(data.name, companyLogoUrl);
      break;
    case 'loginNotification':
      templateData = emailTemplates.loginNotification(data.name, data.loginTime, companyLogoUrl);
      break;
    default:
      throw new Error(`Unknown template: ${template}`);
  }

  return sendEmail({
    to,
    subject: templateData.subject,
    text: templateData.text,
    html: templateData.html,
  });
}
