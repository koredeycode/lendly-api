import { Job } from 'bullmq';

export class EmailProcessor {
  async process(job: Job) {
    switch (job.name) {
      case 'sendWelcomeEmail':
        await this.handleWelcomeEmail(job.data);
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
}
