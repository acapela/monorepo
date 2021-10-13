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
  let currentResult: any = newTarget;

  for (const record of records) {
    if (record.type === "get") {
      currentResult = Reflect.get(currentResult, record.property);
      continue;
    }
    if (record.type === "apply") {
      currentResult = Reflect.apply(currentResult, null, record.args);
      continue;
    }

    throw new Error("Incorrect recording");
  }

  return currentResult;
}
