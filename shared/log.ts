interface LoggerConfig {
  isEnabled?: boolean;
}

type LoggerConfigInput = LoggerConfig | boolean;

function resolveLoggerConfigInput(input: LoggerConfigInput): LoggerConfig {
  if (typeof input === "boolean") {
    return { isEnabled: input };
  }

  return input;
}

export function createLogger(key: string, configInpuf: LoggerConfigInput = true) {
  const config = resolveLoggerConfigInput(configInpuf);

  const prefix = `[${key}]`;

  function getLogArguments(...args: unknown[]) {
    if (args.length === 1 && typeof args[0] === "string") {
      return [`${prefix} ${args[0]}`];
    }
    return [prefix, ...args];
  }

  function log(...args: unknown[]) {
    if (!config.isEnabled) return;
    console.info(...getLogArguments(...args));
  }

  log.trace = (...args: unknown[]) => {
    if (!config.isEnabled) return;
    console.trace(...getLogArguments(...args));
  };

  function msg(initial: TemplateStringsArray, ...interploations: Array<string | number>) {
    return composeInterpolationInput(initial, interploations).join("");
  }

  log.msg = msg;

  return log;
}

function composeInterpolationInput<V>(first: TemplateStringsArray, rest: V[]) {
  const clone = [...first];
  const tail = clone.pop() as string;

  const result: Array<string | V> = [];

  clone.forEach((element, index) => {
    result.push(element);
    result.push(rest[index]);
  });

  result.push(tail);

  return result;
}
