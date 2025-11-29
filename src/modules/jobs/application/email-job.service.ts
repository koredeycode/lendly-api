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
  }) {
    await this.queue.add('sendBookingRejectedEmail', data, {
      attempts: 3,
      backoff: 5000,
    });
  }
}
