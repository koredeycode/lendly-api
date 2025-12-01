import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class EmailJobService {
  constructor(@InjectQueue('email_queue') private queue: Queue) {}

  async sendWelcomeEmail(data: { email: string; name: string }) {
    await this.queue.add('sendWelcomeEmail', data, {
      attempts: 3,
      backoff: 5000,
    });
  }
  async sendBookingRequestedEmail(data: {
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
    await this.queue.add('sendBookingRequestedEmail', data, {
      attempts: 3,
      backoff: 5000,
    });
  }

  async sendBookingApprovedEmail(data: {
    email: string;
    borrowerName: string;
    itemName: string;
    bookingId: string;
  }) {
    await this.queue.add('sendBookingApprovedEmail', data, {
      attempts: 3,
      backoff: 5000,
    });
  }

  async sendBookingRejectedEmail(data: {
    email: string;
    borrowerName: string;
    itemName: string;
    bookingId: string;
  }) {
    await this.queue.add('sendBookingRejectedEmail', data, {
      attempts: 3,
      backoff: 5000,
    });
  }

  async sendBookingOverdueEmail(data: {
    email: string;
    borrowerName: string;
    itemName: string;
    bookingId: string;
  }) {
    await this.queue.add('sendBookingOverdueEmail', data, {
      attempts: 3,
      backoff: 5000,
    });
  }

  async sendPaymentSuccessEmail(data: {
    email: string;
    name: string;
    amount: string;
    transactionId: string;
    date: string;
  }) {
    await this.queue.add('sendPaymentSuccessEmail', data, {
      attempts: 3,
      backoff: 5000,
    });
  }

  async sendPaymentFailedEmail(data: {
    email: string;
    name: string;
    amount: string;
    reason?: string;
    date: string;
  }) {
    await this.queue.add('sendPaymentFailedEmail', data, {
      attempts: 3,
      backoff: 5000,
    });
  }

  async sendWithdrawalSuccessEmail(data: {
    email: string;
    name: string;
    amount: string;
    bankName: string;
    accountNumber: string;
    date: string;
  }) {
    await this.queue.add('sendWithdrawalSuccessEmail', data, {
      attempts: 3,
      backoff: 5000,
    });
  }

  async sendWithdrawalFailedEmail(data: {
    email: string;
    name: string;
    amount: string;
    reason?: string;
    date: string;
  }) {
    await this.queue.add('sendWithdrawalFailedEmail', data, {
      attempts: 3,
      backoff: 5000,
    });
  }

  async sendFundsHeldEmail(data: {
    email: string;
    name: string;
    amount: string;
    itemName: string;
    bookingId: string;
  }) {
    await this.queue.add('sendFundsHeldEmail', data, {
      attempts: 3,
      backoff: 5000,
    });
  }

  async sendFundsReleasedEmail(data: {
    email: string;
    name: string;
    amount: string;
    itemName: string;
    reason?: string;
  }) {
    await this.queue.add('sendFundsReleasedEmail', data, {
      attempts: 3,
      backoff: 5000,
    });
  }

  async sendPayoutReceivedEmail(data: {
    email: string;
    name: string;
    amount: string;
    itemName: string;
    bookingId: string;
  }) {
    await this.queue.add('sendPayoutReceivedEmail', data, {
      attempts: 3,
      backoff: 5000,
    });
  }
  async sendBookingCancelledEmail(data: {
    email: string;
    ownerName: string;
    borrowerName: string;
    itemName: string;
    bookingId: string;
  }) {
    await this.queue.add('sendBookingCancelledEmail', data, {
      attempts: 3,
      backoff: 5000,
    });
  }
}
