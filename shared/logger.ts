import "~config/dotenv";

import pino from "pino";

import { assertDefined } from "~shared/assert";
import { IS_DEV } from "~shared/dev";

const loggingLevel = assertDefined(
  process.env.LOGGING_LEVEL,
  `LOGGING_LEVEL env variable is required. (${Object.keys(pino.levels.values).join(",")})`
);

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

export const logger = pino({
  messageKey: "message",
  level: loggingLevel,
  formatters: {
    // formatting severity to integrate into google cloud logging
    // https://cloud.google.com/logging/docs/agent/configuration#special-fields
    level: (_, level) => ({ level, severity: levelToSeverity(level) }),
  },
  transport: IS_DEV
    ? {
        target: "pino-pretty",
        options: { messageKey: "message", levelKey: "severity", translateTime: "SYS:" },
      }
    : undefined, // aka stdout/err,
});
