import pino from 'pino';
import { ServerResponse } from 'http';
import { Request } from 'express';
import config from 'config';

const NANOSECONDS_IN_MILLISECOND = 10e5;
// 1000000;

const logger = pino({
  messageKey: 'message',
  prettyPrint: process.env.NODE_ENV !== 'production',
  level: config.get('logging.level'),
});

export function info(message: string, params: Record<string, unknown> = {}): void {
  logger.info({ ...params, message });
}

export function warn(message: string, params: Record<string, unknown> = {}): void {
  logger.warn({ ...params, message });
}

export function error(message: string, params: Record<string, unknown> = {}): void {
  logger.error({ ...params, message });
}

export function middleware(req: Request, res: ServerResponse, next: () => void): void {
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
