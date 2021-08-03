import produce from "immer";
import { isPlainObject } from "lodash";
import { isNullish } from "~frontend/../../shared/nullish";
import { typedKeys } from "~frontend/../../shared/object";

type DataInput<D> = Partial<Record<keyof D, unknown>>;

function didTypeOfDataChange<D>(oldData: D, newData: D) {
  if (isNullish(oldData) || isNullish(newData)) {
    return false;
  }

  if (typeof oldData !== typeof newData) {
    return true;
  }

  if (Array.isArray(oldData) !== Array.isArray(newData)) {
    return true;
  }

  if (isPlainObject(oldData) !== isPlainObject(newData)) {
    return true;
  }

  return false;
}

export function getUpdatedDataWithInput<D>(data: D, input: DataInput<D>): D {
  return produce(data, (draft: D) => {
    typedKeys(data).forEach((existingKey) => {
      const inputValue = input[existingKey] as D[keyof D];

      if (inputValue === undefined) {
        return;
      }

      const existingValue = draft[existingKey];

      if (didTypeOfDataChange(existingValue, inputValue)) {
        throw new Error(
          `Cannot update data with input for property "${existingKey}" with different data type than existing data. Old: ${JSON.stringify(
            existingValue
          )}, New: ${JSON.stringify(inputValue)}`
        );
      }

      draft[existingKey] = inputValue;
    });

    return draft;
  });
}
