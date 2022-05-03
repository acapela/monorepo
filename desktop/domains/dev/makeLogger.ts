import chalk from "chalk";
import { isError } from "lodash";

import type { LogEntry, Severity } from "@aca/desktop/bridge/logger";
import { IS_DEV } from "@aca/shared/dev";
import { groupByFilter } from "@aca/shared/groupByFilter";
import { getUUID } from "@aca/shared/uuid";

import { LogAttachment, isLogAttachment } from "./attachment.types";

/*
 This function adds additional parameters to an input string or error

 Image the cases where you have:

 ```
  const obj ={
     foo: true;
  }
  const bar = "id"

  log.error(new AbortError("Fail"), bar,  obj)
```

 This method will take all of the inputs and use the provided error.
 In the background, the code will do this:
  `new AbortError("Fail" + bar + "\n'"" + JSON.stringify(obj))` 

In the cases were no error was provided on first input, 
we'll just do a simple string concatenation.

*/

function formatLogItem(input: unknown) {
  if (isError(input)) {
    return `${input.name}: ${input.message} ${input.stack ?? ""}`;
  }

  if (typeof input === "object") {
    return JSON.stringify(input, null, 2);
  }
  if (typeof input === "string" || typeof input === "number") {
    return input;
  }

  return `${input}`;
}

type ErrorReporter = (body: unknown[], files: LogAttachment[]) => void;

let errorReporter: ErrorReporter | null = null;

let devOnlyLogOverwrite: { prefixes: LogEntry["prefix"][]; allowsAllErrors: boolean } | null = null;

export function registerLoggerErrorReporter(reporter: ErrorReporter) {
  errorReporter = reporter;
}

export function registerDevOnlyLogOverwrite(
  config: { prefixes: LogEntry["prefix"][]; allowsAllErrors: boolean } | null
) {
  devOnlyLogOverwrite = config;
  if (config !== null) {
    console.info(
      chalk.greenBright(`
    **
  
    Registering Dev Only Log Overwrite for : ${config.prefixes.join(", ")}
    
    **
    `)
    );
  } else {
    console.info(
      chalk.greenBright(`
    **
  
    Removing Dev Only Log Overwrite
    
    **
    `)
    );
  }
}

type LogEntryHandler = (entry: LogEntry) => void;

let logEntryHandler: LogEntryHandler | null = null;

export function registerLogEntryHandler(handler: LogEntryHandler) {
  logEntryHandler = handler;
}

export function makeLogger(prefix: string, isEnabled = true) {
  const now = () => new Date().toISOString();

  function performLog(severity: Severity, body: unknown[]) {
    const [logAttachments, logMessages] = groupByFilter(body, isLogAttachment);
    const preparedBody = logMessages.map(formatLogItem);

    const timestamp = now();
    const logEntry: LogEntry = {
      id: getUUID(),
      prefix,
      severity,
      timestamp,
      text: preparedBody.join("\n"),
    };

    logEntryHandler?.(logEntry);

    if (severity === "Error") {
      errorReporter?.(logMessages, logAttachments as LogAttachment[]);
    }

    const [firstItem, ...restItems] = preparedBody;

    return [`[${prefix}][${severity}][${timestamp}]: ${firstItem}`, ...restItems];
  }

  const levels = {
    error(...args: unknown[]) {
      if (!isEnabled) return;

      if (
        IS_DEV &&
        devOnlyLogOverwrite &&
        !devOnlyLogOverwrite.prefixes.includes(prefix) &&
        !devOnlyLogOverwrite.allowsAllErrors
      ) {
        return;
      }

      const result = performLog("Error", args);
      console.error(chalk.redBright(...result));
    },
    warn(...args: unknown[]) {
      if (!isEnabled) return;

      if (IS_DEV && devOnlyLogOverwrite && !devOnlyLogOverwrite.prefixes.includes(prefix)) {
        return;
      }

      const result = performLog("Warning", args);

      console.warn(chalk.yellowBright(...result));
    },
    info(...args: unknown[]) {
      if (!isEnabled) return;

      if (IS_DEV && devOnlyLogOverwrite && !devOnlyLogOverwrite.prefixes.includes(prefix)) {
        return;
      }

      const result = performLog("Info", args);

      console.info(chalk.blueBright(...result));
    },
    debug(...args: unknown[]) {
      if (!isEnabled) return;

      if (IS_DEV && devOnlyLogOverwrite && !devOnlyLogOverwrite.prefixes.includes(prefix)) {
        return;
      }

      const result = performLog("Debug", args);

      console.info(chalk.dim(...result));
    },
    assert(value: unknown, message: string) {
      if (!isEnabled) return;

      if (value) return;

      if (
        IS_DEV &&
        devOnlyLogOverwrite &&
        !devOnlyLogOverwrite.prefixes.includes(prefix) &&
        !devOnlyLogOverwrite.allowsAllErrors
      ) {
        return;
      }

      const result = performLog("Error", [`[Assert]: ${message}`]);

      console.error(chalk.redBright(...result));
    },
  };

  return createFunctionWithProps(levels.info, levels);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

export type FunctionWithProps<F extends AnyFunction, Props> = F & Props;

export function createFunctionWithProps<F extends AnyFunction, Props>(
  func: F,
  props: Props
): FunctionWithProps<F, Props> {
  const functionClone: F = ((...args: Parameters<F>): ReturnType<F> => {
    return func(...args);
  }) as F;

  const descriptorsMap = Object.getOwnPropertyDescriptors(props);

  Object.defineProperties(functionClone, descriptorsMap);

  return functionClone as FunctionWithProps<F, Props>;
}
