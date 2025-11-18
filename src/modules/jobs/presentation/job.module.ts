import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { EmailJobService } from '../application/email-job.service';

@Module({
  imports: [
    BullModule.forRoot({
      connection: { host: 'localhost', port: 6379 },
    }),

    BullModule.registerQueue({
      name: 'email_queue',
    }),
  ],
  providers: [EmailJobService],
  exports: [EmailJobService, BullModule], // so auth module can use it
})
export class JobsModule {}
