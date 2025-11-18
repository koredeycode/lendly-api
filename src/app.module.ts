import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { AuthModule } from './modules/auth/presentation/auth.module';
import { JobsModule } from './modules/jobs/presentation/job.module';
import { QueueMonitorModule } from './modules/queue-monitor/queue-monitor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: (env) => validationSchema.parse(env),
    }),
    AuthModule,
    JobsModule,
    QueueMonitorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
