import { isError } from "lodash";

import { LogEntry, Prefix, Severity, getAllLogsBridge, logStorage } from "@aca/desktop/bridge/logger";
import { getUUID } from "@aca/shared/uuid";

export function makeLogger(prefix: Prefix) {
  const now = () => new Date().toISOString();

  function add<T extends string | Error>({ severity, textOrError }: { severity: Severity; textOrError: T }): T {
    const text: string = isError(textOrError)
      ? `${textOrError.name} - ${textOrError.message}: ${textOrError.stack}`
      : textOrError;

    const timestamp = now();
    const logEntry = {
      id: getUUID(),
      prefix,
      severity,
      timestamp,
      text,
    };
    logStorage.send(logEntry);

    const result = `[${prefix}][${severity}][${timestamp}]: ${text}`;

    return (isError(textOrError) ? new Error(result) : result) as T;
  }

  return {
    error<T extends string | Error>(textOrError: T): T {
      const result = add({
        severity: "Error",
        textOrError,
      });

      console.error(result);

      return result;
    },
    warning<T extends string | Error>(textOrError: T): T {
      const result = add({
        severity: "Warning",
        textOrError,
      });

      console.warn(result);

      return result;
    },
    info<T extends string | Error>(textOrError: T): T {
      const result = add({
        severity: "Info",
        textOrError,
      });

      console.info(result);

      return result;
    },
    debug<T extends string | Error>(textOrError: T): T {
      const result = add({
        severity: "Debug",
        textOrError,
      });

      // console.debug(result);

      return result;
    },
  };
}

const allLogs: LogEntry[] = [];

export function InitializeLogger() {
  logStorage.subscribe((entry) => {
    allLogs.push(entry);
  });

  getAllLogsBridge.handle(async () => {
    return allLogs;
  });
}
