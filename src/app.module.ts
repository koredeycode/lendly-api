import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomThrottlerGuard } from './common/guards/custom-throttler.guard';
import { RedisModule } from './common/redis/redis.module';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { AuthModule } from './modules/auth/presentation/auth.module';
import { BookingModule } from './modules/booking/presentation/booking.module';
import { DatabaseModule } from './modules/database/database.module';
import { HealthModule } from './modules/health/presentation/health.module';
import { ItemModule } from './modules/item/presentation/item.module';
import { JobsModule } from './modules/jobs/presentation/job.module';
import { MessageModule } from './modules/message/presentation/message.module';
import { PaymentModule } from './modules/payment/presentation/payment.module';
import { QueueMonitorModule } from './modules/queue-monitor/queue-monitor.module';
import { ReviewModule } from './modules/review/presentation/review.module';
import { UserModule } from './modules/user/presentation/user.module';
import { WalletModule } from './modules/wallet/presentation/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: (env) => validationSchema.parse(env),
    }),

    LoggerModule.forRoot({
      pinoHttp: {
        timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
        customProps: (req: any, res) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
          client_ip: req.ip || req.socket.remoteAddress,
          http_request: `${req.method} ${req.url} HTTP/${req.httpVersion}`,
          response_status: res.statusCode,
          bytes_sent: res.getHeader('content-length'),
          user_agent: req.headers['user-agent'],
        }),
        serializers: {
          req: () => undefined,
          res: () => undefined,
          err: () => undefined,
        },
        // base: undefined is not directly supported in pinoHttp options type in some versions, but we can try. 
        // Or mixin? 
        // Actually pino-http options extends pino options. base: null removes pid/hostname.
        // But with transport, base might be handled differently. 
        // Let's try to pass base: null (which is the pino way to disable base logs).
        // syntax: use 'base: null' inside the object if TS allows it.
        // pinoHttp options usually keys are strictly typed.
        // Let's rely on formatters logic if base fails? 
        // But wait, transport doesn't allow formatters.level. 
        // Let's skip base for now and focus on adding the required fields.
        
        transport: {
          targets: [
            {
              target: 'pino-roll',
              options: {
                file: './logs/app.log',
                frequency: 'daily',
                mkdir: true,
              },
            },
            ...(process.env.NODE_ENV !== 'production'
              ? [
                  {
                    target: 'pino-pretty',
                    options: {
                      singleLine: true,
                    },
                  },
                ]
              : []),
          ],
        },
      },
    }),
    PrometheusModule.register(),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: 6000,
            limit: 10,
          },
        ],
        storage: new ThrottlerStorageRedisService(process.env.REDIS_URL),
      }),
    }),
    AuthModule,
    JobsModule,
    QueueMonitorModule,
    UserModule,
    WalletModule,
    ItemModule,
    BookingModule,
    MessageModule,
    ReviewModule,
    HealthModule,
    PaymentModule,
    DatabaseModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
