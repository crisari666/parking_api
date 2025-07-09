// src/common/interceptors/logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();

    const { method, url, headers, body } = req;

    const startTime = Date.now();

    console.log('🟡 Incoming Request:', {
      method,
      url,
      headers,
      body,
    });

    return next.handle().pipe(
      tap((responseBody) => {
        const duration = Date.now() - startTime;
        console.log('🟢 Outgoing Response:', {
          method,
          url,
          statusCode: res.statusCode,
          duration: `${duration}ms`,
          responseBody,
        });
      }),
    );
  }
}
