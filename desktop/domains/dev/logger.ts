import { isError } from "lodash";

import { LogEntry, Prefix, Severity, getAllLogsBridge, logStorage } from "@aca/desktop/bridge/logger";
import { getUUID } from "@aca/shared/uuid";

export function makeLogger(prefix: Prefix) {
  const now = () => new Date().toISOString();

  function add({ severity, textOrError }: { severity: Severity; textOrError: string | Error }) {
    console.info("[[[LOG]]] SENDING");
    const text = isError(textOrError)
      ? `${textOrError.name} - ${textOrError.message}: ${textOrError.stack}`
      : textOrError;

    const logEntry = {
      id: getUUID(),
      prefix,
      severity,
      timestamp: now(),
      text,
    };
    logStorage.send(logEntry);
    console.info(JSON.stringify(logEntry));
    console.info(text);
  }

  return {
    error<T extends string | Error>(textOrError: T): T {
      add({
        severity: "Error",
        textOrError,
      });
      return textOrError;
    },
    warning<T extends string | Error>(textOrError: T): T {
      add({
        severity: "Warning",
        textOrError,
      });
      return textOrError;
    },
    info<T extends string | Error>(textOrError: T): T {
      add({
        severity: "Info",
        textOrError,
      });
      return textOrError;
    },
    debug<T extends string | Error>(textOrError: T): T {
      add({
        severity: "Debug",
        textOrError,
      });
      return textOrError;
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
