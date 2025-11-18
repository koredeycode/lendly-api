import { EmailProcessor } from '../modules/jobs/infrastructure/processors/email.processor';
import { Worker } from 'bullmq';

const processor = new EmailProcessor();

// Setup a worker to process the queue
new Worker('email_queue', async (job) => processor.process(job), {
  connection: { host: 'localhost', port: 6379 },
});

console.log('[Worker] Email worker started...');
