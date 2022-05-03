import { computed } from "mobx";

import { deepMemoize } from "@aca/shared/deepMap";

export const createArrayFirstComputed = deepMemoize(function createArrayFirstComputed<T>(array: T[]) {
  return computed((): T | null => {
    return array[0] ?? null;
  });
});
