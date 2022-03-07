import { isError } from "lodash";

import { Severity, logStorage } from "@aca/desktop/bridge/logger";
import { getUUID } from "@aca/shared/uuid";
import { createFunctionWithProps } from "@aca/ui/theme/utils/createFunctionWithProps";

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
function joinInputs<T extends string | Error>(textOrError: T, args: unknown[]): T {
  if (args.length === 0) {
    return textOrError;
  }

  const argsAsText = args
    .map((arg) => {
      if (typeof arg === "object") {
        return JSON.stringify(arg, null, 2);
      }
      if (typeof arg === "string" || typeof arg === "number") {
        return arg;
      }

      return undefined;
    })
    .filter((arg) => !!arg) as string[];

  let compiled: string | Error;

  if (isError(textOrError)) {
    compiled = new Error(
      `${textOrError.name}: ${textOrError.message} ${textOrError.stack ?? ""} ${argsAsText.join("\n")}`
    );
    compiled.name = textOrError.name;
  } else {
    compiled = `${textOrError} ${argsAsText.join("\n")}`;
  }
  return compiled as T;
}

export function makeLogger(prefix: string) {
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

  const levels = {
    error<T extends string | Error>(textOrError: T, ...args: unknown[]): T {
      const result = add({
        severity: "Error",
        textOrError: joinInputs(textOrError, args),
      });

      console.error(result);

      return result;
    },
    warn<T extends string | Error>(textOrError: T, ...args: unknown[]): T {
      const result = add({
        severity: "Warning",
        textOrError: joinInputs(textOrError, args),
      });

      console.warn(result);

      return result;
    },
    info<T extends string | Error>(textOrError: T, ...args: unknown[]): T {
      const result = add({
        severity: "Info",
        textOrError: joinInputs(textOrError, args),
      });

      console.info(result);

      return result;
    },
    debug<T extends string | Error>(textOrError: T, ...args: unknown[]): T {
      const result = add({
        severity: "Debug",
        textOrError: joinInputs(textOrError, args),
      });

      // console.debug(result);

      return result as T;
    },
  };

  return createFunctionWithProps(levels.info, levels);
}
