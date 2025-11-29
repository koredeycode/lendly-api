import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // If the response is already formatted (e.g. from a controller that does it manually), use it.
        // Otherwise, wrap it.
        // Note: This is a simple check. You might want to enforce a stricter contract.
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        if (data && data.message && data.data) {
          return {
            statusCode,
            ...data,
          };
        }

        return {
          statusCode,
          message: 'Success',
          data,
        };
      }),
    );
  }
}
