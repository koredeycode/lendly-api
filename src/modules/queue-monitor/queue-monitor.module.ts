import { Module } from '@nestjs/common';
import { JobsModule } from '../jobs/presentation/job.module';
import { QueueMonitorService } from './queue-monitor.service';

@Module({
  imports: [JobsModule],
  providers: [QueueMonitorService],
})
export class QueueMonitorModule {}
