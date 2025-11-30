import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { bookingApprovedTemplate } from './templates/booking-approved.template';
import { bookingRejectedTemplate } from './templates/booking-rejected.template';
import { bookingRequestTemplate } from './templates/booking-request.template';
import { welcomeTemplate } from './templates/welcome.template';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    try {
      // Create a transporter using Ethereal for development
      const testAccount = await nodemailer.createTestAccount();

      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      this.logger.log('Email transporter initialized with Ethereal');
      this.logger.log(`Ethereal User: ${testAccount.user}`);
    } catch (error) {
      this.logger.error('Failed to initialize email transporter', error);
    }
  }

  async sendEmail(to: string, subject: string, html: string, text?: string) {
    if (!this.transporter) {
      await this.initializeTransporter();
    }

    try {
      const info = await this.transporter.sendMail({
        from: '"Lendly Support" <support@lendly.com>',
        to,
        subject,
        text: text || 'Please view this email in an HTML compatible client.',
        html,
      });

      this.logger.log(`Message sent: ${info.messageId}`);
      this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

      return info;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error);
      throw error;
    }
  }

  async sendBookingRequestEmail(
    to: string,
    data: {
      ownerName: string;
      borrowerName: string;
      itemName: string;
      startDate: string;
      endDate: string;
      totalPrice: string;
      message?: string;
      bookingUrl: string;
    },
  ) {
    const html = bookingRequestTemplate(data);
    const subject = `New Booking Request for ${data.itemName}`;
    return this.sendEmail(to, subject, html);
  }

  async sendBookingApprovedEmail(
    to: string,
    data: {
      borrowerName: string;
      itemName: string;
      bookingUrl?: string;
    },
  ) {
    const html = bookingApprovedTemplate(data);
    const subject = `Booking Approved: ${data.itemName}`;
    return this.sendEmail(to, subject, html);
  }

  async sendBookingRejectedEmail(
    to: string,
    data: {
      borrowerName: string;
      itemName: string;
    },
  ) {
    const html = bookingRejectedTemplate(data);
    const subject = `Booking Update: ${data.itemName}`;
    return this.sendEmail(to, subject, html);
  }

  async sendWelcomeEmail(to: string, name: string) {
    const html = welcomeTemplate({ name });
    const subject = 'Welcome to Lendly! 🚀';
    return this.sendEmail(to, subject, html);
  }
}
