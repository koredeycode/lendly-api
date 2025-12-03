
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import Redis from 'ioredis';

@Injectable()
export class IdempotencyGuard implements CanActivate {
  private readonly logger = new Logger(IdempotencyGuard.name);

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const idempotencyKey = request.headers['idempotency-key'] as string;

    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header is required');
    }

    const userId = (request as any).user?.id;
    const key = `idempotency:${userId || 'anon'}:${idempotencyKey}`;

    const cachedResponse = await this.redis.get(key);

    if (cachedResponse) {
      this.logger.log(`Idempotency hit for key: ${key}`);
      const { status, body } = JSON.parse(cachedResponse);
      response.status(status).json(body);
      return false; // Prevent further execution
    }

    // Hook into response.send to cache the result
    const originalSend = response.send;
    response.send = (body: any) => {
      // Restore original send to avoid infinite recursion if called again
      response.send = originalSend;

      // Cache the response
      // We need to be careful about what 'body' is. It could be a string or object.
      // Express .json() calls .send() with a stringified object.
      // But NestJS interceptors might change this flow.
      // Let's try to parse if it's a string, or just store as is.
      
      let responseBody = body;
      try {
          if (typeof body === 'string') {
              responseBody = JSON.parse(body);
          }
      } catch (e) {
          // ignore
      }

      const responseData = {
        status: response.statusCode,
        body: responseBody,
      };

      this.redis.set(key, JSON.stringify(responseData), 'EX', 60 * 60 * 24); // 24 hours TTL

      return originalSend.call(response, body);
    };

    return true;
  }
}
