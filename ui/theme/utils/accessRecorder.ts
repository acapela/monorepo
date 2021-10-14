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

export function replayAccess(newTarget: object, records: AccessAction[]) {
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

  return currentResult;
}
