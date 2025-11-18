import { Worker } from 'bullmq';
import 'dotenv/config';
import { EmailProcessor } from '../modules/jobs/infrastructure/processors/email.processor';

const processor = new EmailProcessor();

// Setup a worker to process the queue
new Worker('email_queue', async (job) => processor.process(job), {
  connection: { url: process.env.REDIS_URL },
});

console.log('[Worker] Email worker started...');
