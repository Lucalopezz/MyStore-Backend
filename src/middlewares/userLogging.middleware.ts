import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { winstonConfig } from 'src/common/config/winston.config';
import { Logger } from 'winston';
import * as winston from 'winston';

const logger: Logger = winston.createLogger(winstonConfig);

@Injectable()
export class UserLoggingMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    const tokenPayload = req.tokenPayload;
    const userId = tokenPayload?.sub || 'Unauthenticated';
    const userEmail = tokenPayload?.email || 'N/A';
    const method = req.method;
    const url = req.originalUrl;
    const timestamp = new Date().toISOString();
    const ip = req.ip;

    logger.info({
      message: 'User Activity',
      userId,
      userEmail,
      method,
      url,
      timestamp,
      ip,
    });

    res.on('finish', () => {
      if (res.statusCode >= 400) {
        logger.error({
          message: 'Error Response',
          userId,
          userEmail,
          method,
          url,
          timestamp,
          ip,
          statusCode: res.statusCode,
        });
      }
    });

    next();
  }
}
