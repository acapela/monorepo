import "@acapela/config/dotenv";
import pino from "pino";
import { ServerResponse } from "http";
import { Request } from "express";

const NANOSECONDS_IN_MILLISECOND = 10e5;

const logger = pino({
  messageKey: "message",
  prettyPrint: process.env.NODE_ENV !== "production",
  level: process.env.LOGGING_LEVEL,
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
    info("Request finished", {
      url: req.url,
      method: req.method,
      status: res.statusCode,
      host: req.hostname,
      userAgent: req.get("user-agent"),
      timeInMilliseconds: process.hrtime(startTime)[1] / NANOSECONDS_IN_MILLISECOND,
    });
  });
  next();
}

export const log = {
  info,
  warn,
  error,
  middleware,
};

export default log;
