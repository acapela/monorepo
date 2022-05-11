type AnyKey = string | number | symbol;

export type AccessAction =
  | {
      type: "get";
      property: AnyKey;
    }
  | {
      type: "apply";
      args: unknown[];
    };

// Replay access is considered pure - it will cache the same result for the same path to replay
const replayAccessCache = new WeakMap<object, WeakMap<AccessAction[], unknown>>();

export function replayAccess(newTarget: object, records: AccessAction[]) {
  let targetCache = replayAccessCache.get(newTarget);

  if (!targetCache) {
    targetCache = new WeakMap();
    replayAccessCache.set(newTarget, targetCache);
  }

  const cachedResult = targetCache.get(records);

  if (cachedResult !== undefined) {
    return cachedResult;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let currentResult: any = newTarget;

  for (const record of records) {
    if (record.type === "get") {
      currentResult = currentResult[record.property];
      continue;
    }
    if (record.type === "apply") {
      // eslint-disable-next-line prefer-spread
      currentResult = (currentResult as Function).apply(null, record.args);
      continue;
    }

    throw new Error("Incorrect recording");
  }

  targetCache.set(records, currentResult);

  return currentResult;
}
