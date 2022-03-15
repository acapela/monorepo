import { isError } from "lodash";

import { LogEntry, Severity, logStorage } from "@aca/desktop/bridge/logger";
import { getUUID } from "@aca/shared/uuid";

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

type ErrorReporter = (body: unknown[]) => void;

let errorReporter: ErrorReporter | null = null;

export function registerLoggerErrorReporter(reporter: ErrorReporter) {
  errorReporter = reporter;
}

export function makeLogger(prefix: string, isEnabled = true) {
  const now = () => new Date().toISOString();

  function performLog(severity: Severity, body: unknown[]) {
    const preparedBody = body.map(formatLogItem);

    const timestamp = now();
    const logEntry: LogEntry = {
      id: getUUID(),
      prefix,
      severity,
      timestamp,
      text: preparedBody.join("\n"),
    };

    logStorage.send(logEntry);

    if (severity === "Error") {
      errorReporter?.(body);
    }

    const [firstItem, ...restItems] = preparedBody;

    return [`[${prefix}][${severity}][${timestamp}]: ${firstItem}`, ...restItems];
  }

  const levels = {
    error(...args: unknown[]) {
      if (!isEnabled) return;
      const result = performLog("Error", args);

      console.error(...result);
    },
    warn(...args: unknown[]) {
      if (!isEnabled) return;

      const result = performLog("Warning", args);

      console.warn(...result);
    },
    info(...args: unknown[]) {
      if (!isEnabled) return;

      const result = performLog("Info", args);

      console.info(...result);
    },
    debug(...args: unknown[]) {
      if (!isEnabled) return;

      const result = performLog("Debug", args);

      console.info(...result);
    },
    assert(value: unknown, message: string) {
      if (!isEnabled) return;

      if (value) return;

      const result = performLog("Error", [`[Assert]: ${message}`]);

      console.error(...result);
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
