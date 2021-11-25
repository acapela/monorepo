import { noop } from "lodash";

export const IS_DEV = process.env.STAGE === "staging" || process.env.STAGE === "production";

const groupsTotal = new Map<string, number>();

export function measureTime(name: string, isEnabled = true) {
  if (!isEnabled) return noop;

  const start = performance.now();

  return function end() {
    const duration = performance.now() - start;
    const currentTotal = groupsTotal.get(name) ?? 0;

    const newTotal = currentTotal + duration;

    groupsTotal.set(name, newTotal);

    console.info(`⏱ ${name} - ${duration}ms (total ${newTotal}ms)`);
  };
}

export function devAssignWindowVariable(name: string, value: unknown) {
  if (!IS_DEV) return;
  if (typeof window === "undefined") return;

  Reflect.set(window, name, value);
}

export function createDebugLogger(name: string, isEnabled?: boolean) {
  return function log(...input: unknown[]) {
    if (!IS_DEV || isEnabled == false) return;
    console.info(`[${name}]`, ...input);
  };
}
