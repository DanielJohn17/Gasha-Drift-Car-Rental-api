import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  details?: unknown;
}

type PayloadTooLargeError = Error & {
  readonly type?: unknown;
  readonly status?: unknown;
  readonly statusCode?: unknown;
};

const isPayloadTooLargeError = (exception: unknown): exception is PayloadTooLargeError => {
  if (!(exception instanceof Error)) {
    return false;
  }
  const payloadTooLargeException: PayloadTooLargeError = exception as PayloadTooLargeError;
  const hasPayloadTooLargeName: boolean = payloadTooLargeException.name === 'PayloadTooLargeError';
  const hasEntityTooLargeType: boolean = payloadTooLargeException.type === 'entity.too.large';
  const hasPayloadTooLargeStatus: boolean = payloadTooLargeException.status === HttpStatus.PAYLOAD_TOO_LARGE || payloadTooLargeException.statusCode === HttpStatus.PAYLOAD_TOO_LARGE;
  return hasPayloadTooLargeName || hasEntityTooLargeType || hasPayloadTooLargeStatus;
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';
    let details: unknown = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || message;
        error = (responseObj.error as string) || error;
        details = responseObj.details;
      }
    } else if (exception instanceof Error) {
      if (isPayloadTooLargeError(exception)) {
        status = HttpStatus.PAYLOAD_TOO_LARGE;
        message = 'Request entity too large';
        error = 'Payload Too Large';
      } else {
        message = exception.message;
        error = exception.name;
      }
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (details !== undefined) {
      (errorResponse as ErrorResponse & { details: unknown }).details = details;
    }

    // Log error details
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - ${status} - ${message}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(`${request.method} ${request.url} - ${status} - ${message}`);
    }

    response.status(status).json(errorResponse);
  }
}
