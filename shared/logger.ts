import "~config/dotenv";

import { ServerResponse } from "http";

import { Request } from "express";
import pino from "pino";

import { assertDefined } from "./assert";
import { IS_DEV } from "./dev";

const NANOSECONDS_IN_MILLISECOND = 10e5;

const loggingLevel = assertDefined(
  process.env.LOGGING_LEVEL,
  `LOGGING_LEVEL env variable is required. ('fatal', 'error', 'warn', 'info', 'debug', 'trace')`
);

const logger = pino({
  messageKey: "message",
  prettyPrint: process.env.NODE_ENV !== "production",
  level: loggingLevel,
  formatters: {
    // formatting severity to integrate into google cloud logging
    // https://cloud.google.com/logging/docs/agent/configuration#special-fields
    level(_, number) {
      return { level: number, severity: levelToSeverity(number) };
    },
  },
});

function levelToSeverity(level: number): string {
  if (level < 30) {
    return "DEBUG";
  }
  if (level <= 30) {
    return "INFO";
  }
  if (level <= 39) {
    return "NOTICE";
  }
  if (level <= 49) {
    return "WARNING";
  }
  if (level <= 59) {
    return "ERROR";
  }
  if (level <= 69) {
    return "CRITICAL";
  } // also fatal
  if (level <= 79) {
    return "ALERT";
  }
  if (level <= 99) {
    return "EMERGENCY";
  }
  return "DEFAULT";
}

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
  res.once("finish", () => {
    const requestStatusDescription = `[${req.method}] ${req.url} (status: ${req.statusCode})`;
    if (!IS_DEV) {
      info(`Request finished - ${requestStatusDescription}`, {
        host: req.hostname,
        userAgent: req.get("user-agent"),
        timeInMilliseconds: process.hrtime(startTime)[1] / NANOSECONDS_IN_MILLISECOND,
      });
    } else {
      info(`Request finished - ${requestStatusDescription}`);
    }
  });
  next();
}

export const log = {
  info,
  warn,
  error,
  middleware,
};
