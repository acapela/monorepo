import produce from "immer";

export type ValueUpdater<T> = (draft: T) => void;

export function updateValue<T>(currentValue: T, updater: ValueUpdater<T>): T {
  return produce(currentValue, (draft) => {
    updater(draft as T);

    return draft;
  });
}
