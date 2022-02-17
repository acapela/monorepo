import produce from "immer";
import { isPrimitive } from "utility-types";

export type FunctionUpdater<T> = (draft: T) => void;

export type ValueUpdater<T> = FunctionUpdater<T> | Partial<T>;

export function updateValue<T>(currentValue: T, updater: ValueUpdater<T>): T {
  if (typeof updater === "function") {
    return produce(currentValue, (draft) => {
      updater(draft as T);

      return draft;
    });
  }

  if (isPrimitive(updater)) {
    return updater as unknown as T;
  }

  return { ...currentValue, ...updater };
}
