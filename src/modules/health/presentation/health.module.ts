import { Module } from '@nestjs/common';
import { HealthService } from '../application/health.service';
import { HealthController } from './health.controller';

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [],
})
export class HealthModule {}
