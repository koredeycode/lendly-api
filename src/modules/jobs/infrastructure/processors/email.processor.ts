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
      case 'sendPaymentSuccessEmail':
        await this.handlePaymentSuccessEmail(job.data);
        break;
      case 'sendPaymentFailedEmail':
        await this.handlePaymentFailedEmail(job.data);
        break;
      case 'sendWithdrawalSuccessEmail':
        await this.handleWithdrawalSuccessEmail(job.data);
        break;
      case 'sendWithdrawalFailedEmail':
        await this.handleWithdrawalFailedEmail(job.data);
        break;
      case 'sendFundsHeldEmail':
        await this.handleFundsHeldEmail(job.data);
        break;
      case 'sendFundsReleasedEmail':
        await this.handleFundsReleasedEmail(job.data);
        break;
      case 'sendPayoutReceivedEmail':
        await this.handlePayoutReceivedEmail(job.data);
        break;
      default:
        console.log('Unknown job:', job.name);
    }
  }

  private async handleWelcomeEmail(data: { email: string; name: string }) {
    console.log('[EmailProcessor] Sending welcome email to:', data.email);
    await this.emailService.sendWelcomeEmail(data.email, data.name);
    
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
    bookingId: string;
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
      bookingId: data.bookingId,
    });
  }

  private async handleBookingApprovedEmail(data: {
    email: string;
    borrowerName: string;
    itemName: string;
    bookingId: string;
  }) {
    console.log(
      `[EmailProcessor] Sending booking approved email to borrower ${data.email}. Item: ${data.itemName}`,
    );
    await this.emailService.sendBookingApprovedEmail(data.email, {
      borrowerName: data.borrowerName,
      itemName: data.itemName,
      bookingId: data.bookingId,
    });
  }

  private async handleBookingRejectedEmail(data: {
    email: string;
    borrowerName: string;
    itemName: string;
    bookingId: string;
  }) {
    console.log(
      `[EmailProcessor] Sending booking rejected email to borrower ${data.email}. Item: ${data.itemName}`,
    );
    await this.emailService.sendBookingRejectedEmail(data.email, {
      borrowerName: data.borrowerName,
      itemName: data.itemName,
      bookingId: data.bookingId,
    });
  }

  private async handlePaymentSuccessEmail(data: any) {
    console.log(
      `[EmailProcessor] Sending payment success email to ${data.email}`,
    );
    await this.emailService.sendPaymentSuccessEmail(data.email, data);
  }

  private async handlePaymentFailedEmail(data: any) {
    console.log(
      `[EmailProcessor] Sending payment failed email to ${data.email}`,
    );
    await this.emailService.sendPaymentFailedEmail(data.email, data);
  }

  private async handleWithdrawalSuccessEmail(data: any) {
    console.log(
      `[EmailProcessor] Sending withdrawal success email to ${data.email}`,
    );
    await this.emailService.sendWithdrawalSuccessEmail(data.email, data);
  }

  private async handleWithdrawalFailedEmail(data: any) {
    console.log(
      `[EmailProcessor] Sending withdrawal failed email to ${data.email}`,
    );
    await this.emailService.sendWithdrawalFailedEmail(data.email, data);
  }

  private async handleFundsHeldEmail(data: any) {
    console.log(
      `[EmailProcessor] Sending funds held email to ${data.email}`,
    );
    await this.emailService.sendFundsHeldEmail(data.email, data);
  }

  private async handleFundsReleasedEmail(data: any) {
    console.log(
      `[EmailProcessor] Sending funds released email to ${data.email}`,
    );
    await this.emailService.sendFundsReleasedEmail(data.email, data);
  }

  private async handlePayoutReceivedEmail(data: any) {
    console.log(
      `[EmailProcessor] Sending payout received email to ${data.email}`,
    );
    await this.emailService.sendPayoutReceivedEmail(data.email, data);
  }
}
