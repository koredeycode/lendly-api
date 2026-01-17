import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        typeof message === 'string'
          ? message
          : (message as any).message || message,
      error: typeof message === 'object' ? (message as any).error : undefined,
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      const errorLog = {
          req: { method: request.method, url: request.url },
          status,
          error: exception instanceof Error ? exception.message : 'Unknown error',
          stack: exception instanceof Error ? exception.stack : undefined,
      };
      this.logger.error(errorLog, 'Internal Server Error');
    } else {
      const warnLog = {
          req: { method: request.method, url: request.url },
          status,
          message: errorResponse.message,
          error: errorResponse.error,
      };
      this.logger.warn(warnLog, 'Client Error');
    }

    response.status(status).json(errorResponse);
  }
}
