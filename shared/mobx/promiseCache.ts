import { observable, runInAction } from "mobx";

import { createFunctionWithProps } from "../functions";
import { createSharedPromise } from "../promises";

export function createObservablePromiseCache<T>(getter: () => Promise<T>, defaultValue: T) {
  const currentValue = observable.box(defaultValue, { deep: false });

  const getNewResults = createSharedPromise(getter);

  async function reloadValue() {
    if (getNewResults.getIsInProgress()) return;

    const newValue = await getNewResults();

    runInAction(() => {
      currentValue.set(newValue);
    });
  }

  return createFunctionWithProps(
    () => {
      reloadValue();

      return currentValue.get();
    },
    { reloadValue }
  );
}
