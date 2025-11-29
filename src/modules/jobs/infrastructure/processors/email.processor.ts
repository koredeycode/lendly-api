import { Job } from 'bullmq';

export class EmailProcessor {
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
    await new Promise((res) => setTimeout(res, 10000));
    console.log('[EmailProcessor] Done:', data.email);
  }

  private async handleBookingRequestedEmail(data: {
    email: string;
    ownerName: string;
    borrowerName: string;
    itemName: string;
  }) {
    console.log(
      `[EmailProcessor] Sending booking requested email to owner ${data.email}. Borrower: ${data.borrowerName}, Item: ${data.itemName}`,
    );
  }

  private async handleBookingApprovedEmail(data: {
    email: string;
    borrowerName: string;
    itemName: string;
  }) {
    console.log(
      `[EmailProcessor] Sending booking approved email to borrower ${data.email}. Item: ${data.itemName}`,
    );
  }

  private async handleBookingRejectedEmail(data: {
    email: string;
    borrowerName: string;
    itemName: string;
  }) {
    console.log(
      `[EmailProcessor] Sending booking rejected email to borrower ${data.email}. Item: ${data.itemName}`,
    );
  }
}
