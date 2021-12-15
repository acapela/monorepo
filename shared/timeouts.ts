import { createInterval } from "./time";

interface AwaitingTimeout {
  deadline: number;
  callback: () => void;
}

export function createTimeoutBatcher(callInterval = 500) {
  const awaitingTimeouts = new Set<AwaitingTimeout>();

  let currentFlushInterval: ReturnType<typeof createInterval> | null;

  function add(callback: () => void, time: number) {
    awaitingTimeouts.add({ callback, deadline: Date.now() + time });

    if (!currentFlushInterval) {
      currentFlushInterval = createInterval(flush, callInterval);
    }
  }

  function flush() {
    const now = Date.now();
    [...awaitingTimeouts].forEach((nextTimeout) => {
      if (nextTimeout.deadline >= now) {
        awaitingTimeouts.delete(nextTimeout);
        nextTimeout.callback();
      }
    });

    if (awaitingTimeouts.size === 0) {
      currentFlushInterval?.();
      currentFlushInterval = null;
    }
  }

  return add;
}
