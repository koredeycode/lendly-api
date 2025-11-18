import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailJobService {
  constructor(@InjectQueue('email_queue') private queue: Queue) {}

  async sendWelcomeEmail(data: { email: string; name: string }) {
    await this.queue.add('sendWelcomeEmail', data, {
      attempts: 3,
      backoff: 5000,
    });
  }
}
