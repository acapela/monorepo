import { useRef } from "react";

import { unsafeAssert } from "@aca/shared/assert";

/**
 * Will result array from provided one, except if input is different - it will only add new items,
 * never removing existing ones
 */
export function useGrowingArray<T>(incomingArray: T[], keyGetter?: (item: T) => string) {
  const resultArray = useRef(incomingArray).current;

  const resultKeys = keyGetter ? resultArray.map(keyGetter) : null;

  incomingArray.forEach((incomingItem) => {
    if (resultArray.includes(incomingItem)) return;

    if (!keyGetter) {
      resultArray.push(incomingItem);
      return;
    }

    const incomingItemKey = keyGetter(incomingItem);

    unsafeAssert(resultKeys);

    if (resultKeys.includes(incomingItemKey)) return;

    resultArray.push(incomingItem);
  });

  return resultArray;
}
