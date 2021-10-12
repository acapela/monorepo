import { noop } from "lodash";

export function isDev() {
  return !["staging", "production"].includes(process.env.STAGE);
}

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
