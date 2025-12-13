import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import './instrumentation';
import { QueueMonitorService } from './modules/queue-monitor/queue-monitor.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip extra properties
      forbidNonWhitelisted: true, // throw error on extra properties
      transform: true, // auto-transform payload to DTO instance
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const queueMonitor = app.get(QueueMonitorService);
  queueMonitor.setApp(app);

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Lendly API')
    .setDescription('API documentation for Lendly project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  console.log('🚀 Swagger docs running on http://localhost:5000/api-docs');

  app.getHttpAdapter().get('/api-docs-json', (_req, res) => {
    res.json(document);
  });

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
