import pino from 'pino';
import { RequestHandler } from 'express';
import httpLogger from 'pino-http';

import { IS_PRODUCTION } from './config';

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

export function middleware(): RequestHandler {
  return httpLogger({
    logger,
  });
}

export default {
  info,
  warn,
  error,
  middleware,
};
