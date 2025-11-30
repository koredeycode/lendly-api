import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import 'dotenv/config';
import { EmailJobService } from '../application/email-job.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: { url: process.env.REDIS_URL },
    }),

    BullModule.registerQueue({
      name: 'email_queue',
    }),
    EmailModule,
  ],
  providers: [EmailJobService],
  exports: [EmailJobService, BullModule], // so auth module can use it
})
export class JobsModule {}
