import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { QueueMonitorService } from './modules/queue-monitor/queue-monitor.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip extra properties
      forbidNonWhitelisted: true, // throw error on extra properties
      transform: true, // auto-transform payload to DTO instance
    }),
  );

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
  app.getHttpAdapter().get('/api-docs-json', (_req, res) => {
    res.json(document);
  });

  app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.url);
    next();
  });

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
