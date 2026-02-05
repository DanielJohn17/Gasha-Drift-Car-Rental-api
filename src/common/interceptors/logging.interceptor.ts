import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: { userId: string; role: string };
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || 'unknown';
    const userId = request.user?.userId || 'anonymous';

    const startTime = Date.now();

    this.logger.log(`→ ${method} ${url} - User: ${userId} - IP: ${ip} - Agent: ${userAgent}`);

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          this.logger.log(`← ${method} ${url} - ${duration}ms`);
        },
        error: error => {
          const duration = Date.now() - startTime;
          this.logger.error(`✖ ${method} ${url} - ${duration}ms - Error: ${error.message}`);
        },
      }),
    );
  }
}
