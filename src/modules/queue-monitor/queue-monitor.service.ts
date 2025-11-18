import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { InjectQueue } from '@nestjs/bullmq';
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueMonitorService implements OnModuleInit {
  constructor(@InjectQueue('email_queue') private emailQueue: Queue) {}

  private app: INestApplication;

  setApp(app: INestApplication) {
    this.app = app;
  }

  onModuleInit() {
    if (!this.app) return;
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/api/queues');

    createBullBoard({
      queues: [new BullMQAdapter(this.emailQueue)],
      serverAdapter,
    });

    this.app.use('/api/queues', serverAdapter.getRouter());

    console.log(
      '🚀 Bull Board dashboard running on http://localhost:5000/api/queues',
    );
  }
}
