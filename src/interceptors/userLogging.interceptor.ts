import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Logger } from 'winston';
import * as winston from 'winston';
import { winstonConfig } from 'src/common/config/winston.config';
import { REQUEST_TOKEN_PAYLOAD_KEY } from 'src/auth/auth.constants';

const logger: Logger = winston.createLogger(winstonConfig);

@Injectable()
export class UserLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const tokenPayload = request[REQUEST_TOKEN_PAYLOAD_KEY] || {};
    const userId = tokenPayload?.sub || 'Unauthenticated';
    const userEmail = tokenPayload?.email || 'N/A';
    const method = request.method;
    const url = request.originalUrl;
    const timestamp = new Date().toISOString();
    const ip = request.ip;

    logger.info({
      message: 'User Activity',
      userId,
      userEmail,
      method,
      url,
      timestamp,
      ip,
    });

    response.on('finish', () => {
      if (response.statusCode >= 400) {
        logger.error({
          message: 'Error Response',
          userId,
          userEmail,
          method,
          url,
          timestamp,
          ip,
          statusCode: response.statusCode,
        });
      }
    });

    return next.handle();
  }
}
