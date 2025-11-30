import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailService } from '../../email/email.service';

@Injectable()
export class EmailProcessor {
  constructor(private readonly emailService: EmailService) {}

  async process(job: Job) {
    switch (job.name) {
      case 'sendWelcomeEmail':
        await this.handleWelcomeEmail(job.data);
        break;
      case 'sendBookingRequestedEmail':
        await this.handleBookingRequestedEmail(job.data);
        break;
      case 'sendBookingApprovedEmail':
        await this.handleBookingApprovedEmail(job.data);
        break;
      case 'sendBookingRejectedEmail':
        await this.handleBookingRejectedEmail(job.data);
        break;
      default:
        console.log('Unknown job:', job.name);
    }
  }

  private async handleWelcomeEmail(data: { email: string; name: string }) {
    console.log('[EmailProcessor] Sending welcome email to:', data.email);
    await this.emailService.sendWelcomeEmail(data.email, data.name);
    console.log('[EmailProcessor] Done:', data.email);
  }

  private async handleBookingRequestedEmail(data: {
    email: string;
    ownerName: string;
    borrowerName: string;
    itemName: string;
    startDate: string;
    endDate: string;
    totalPrice: string;
    message?: string;
    bookingUrl: string;
  }) {
    console.log(
      `[EmailProcessor] Sending booking requested email to owner ${data.email}. Borrower: ${data.borrowerName}, Item: ${data.itemName}`,
    );
    await this.emailService.sendBookingRequestEmail(data.email, {
      ownerName: data.ownerName,
      borrowerName: data.borrowerName,
      itemName: data.itemName,
      startDate: data.startDate,
      endDate: data.endDate,
      totalPrice: data.totalPrice,
      message: data.message,
      bookingUrl: data.bookingUrl,
    });
  }

  private async handleBookingApprovedEmail(data: {
    email: string;
    borrowerName: string;
    itemName: string;
  }) {
    console.log(
      `[EmailProcessor] Sending booking approved email to borrower ${data.email}. Item: ${data.itemName}`,
    );
    await this.emailService.sendBookingApprovedEmail(data.email, {
      borrowerName: data.borrowerName,
      itemName: data.itemName,
      bookingUrl: 'https://lendly.app/bookings', // TODO: Add specific booking URL
    });
  }

  private async handleBookingRejectedEmail(data: {
    email: string;
    borrowerName: string;
    itemName: string;
  }) {
    console.log(
      `[EmailProcessor] Sending booking rejected email to borrower ${data.email}. Item: ${data.itemName}`,
    );
    await this.emailService.sendBookingRejectedEmail(data.email, {
      borrowerName: data.borrowerName,
      itemName: data.itemName,
    });
  }
}
