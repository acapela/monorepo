import pino from 'pino';
import { ServerResponse } from 'http';
import { Request } from 'express';

import { IS_PRODUCTION } from './config';

const NANOSECONDS_IN_MILLISECOND = 1000000;

const logger = pino({
  messageKey: 'message',
  prettyPrint: !IS_PRODUCTION,
});

export function info(message: string, params: object = {}): void {
  logger.info({ ...params, message });
}

export function warn(message: string, params: object = {}): void {
  logger.warn({ ...params, message });
}

export function error(message: string, params: object = {}): void {
  logger.error({ ...params, message });
}

export function middleware(req: Request, res: ServerResponse, next: () => any) {
  const startTime = process.hrtime();
  res.once('finish', () => {
    info('Request finished', {
      url: req.url,
      method: req.method,
      status: res.statusCode,
      host: req.hostname,
      userAgent: req.get('user-agent'),
      timeInMilliseconds: process.hrtime(startTime)[1] / NANOSECONDS_IN_MILLISECOND,
    });
  });
  next();
}

export default {
  info,
  warn,
  error,
  middleware,
};
