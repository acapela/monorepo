import { isEqual, sortBy } from "lodash";

import { None } from "@aca/shared/none";

export function removeElementFromArray<T>(arr: T[], element: T) {
  const index = arr.indexOf(element);
  if (index > -1) {
    arr.splice(index, 1);
    return true;
  }

  return false;
}

export function removeElementsFromArrayByFilter<T>(arr: T[], filter: (item: T) => boolean) {
  for (const item of arr) {
    const shouldRemove = filter(item);

    if (shouldRemove) {
      removeElementFromArray(arr, item);
    }
  }
}

export type MaybeArray<T> = T | T[];

export function convertMaybeArrayToArray<T>(input: T | T[]): T[] {
  if (Array.isArray(input)) return [...input];

  return [input];
}

export function getIsLastArrayElement<T>(array: T[], item: T) {
  const index = array.indexOf(item);

  return index === array.length - 1;
}

export function getLastElementFromArray<T>(array: T[]): T | null {
  const lastIndex = array.length - 1;

  return array[lastIndex] ?? null;
}

/**
 * This function will pick 'random' item from array, but in a repetitive way, basing on provided 'seed' string.
 * As long as the seed is the same, result of 'random' pick will be the same as well.
 *
 * It is useful for 'randomized' effects, but in a such way that give the same result every time.
 */
export function pickArrayItemWithSeed<T>(array: T[], seed: string) {
  if (!array.length) return null;

  const seedAsNumber = seed
    .split("")
    .map((seedChar) => seedChar.charCodeAt(0))
    .reduce((nextCharNumber, buffer) => nextCharNumber + buffer, 1);

  const index = seedAsNumber % array.length;

  return array[index];
}

/**
 * This function will pick n 'random' items from array, but in a repetitive way, basing on provided 'seed' string.
 * As long as the seed is the same, result of 'random' pick will be the same as well.
 *
 * It is useful for 'randomized' effects, but in a such way that give the same result every time.
 */
export function pickNArrayItemsWithSeed<T>(array: T[], countToPick: number, seed: string) {
  const arrayClone = [...array];
  const pickedItems: T[] = [];

  Array.from({ length: countToPick }).forEach(() => {
    const nextItem = pickArrayItemWithSeed(arrayClone, seed);

    if (nextItem === null) return;

    pickedItems.push(nextItem);
    removeElementFromArray(arrayClone, nextItem);
  });

  return pickedItems;
}

function getNextIndexInArray<T>(items: T[], currentIndex: number) {
  const nextNaturalIndex = currentIndex + 1;

  if (nextNaturalIndex >= items.length) {
    return 0;
  }

  return nextNaturalIndex;
}

interface ArrayLoopConfig<T> {
  keyGetter?: (item: T) => string;
  loop?: boolean;
}

/**
 * This hook allows 'getting next value' of an array with a simple callback.
 *
 * It's useful for UI cases where you go to next option by clicking previous one, eg video playback speed.
 */
export function getNextItemInArray<T>(items: T[], activeItem: T, { keyGetter, loop }: ArrayLoopConfig<T> = {}) {
  const activeItemIndex = items.findIndex((item) => {
    if (keyGetter) {
      return keyGetter(activeItem) === keyGetter(item);
    }
    return item === activeItem;
  });

  if (activeItemIndex === items.length - 1 && !loop) return null;

  const nextIndex = getNextIndexInArray(items, activeItemIndex);

  const nextItem = items[nextIndex];

  return nextItem;
}

function getPreviousIndexInArray<T>(items: T[], currentIndex: number) {
  const previousNaturalIndex = currentIndex - 1;

  if (previousNaturalIndex < 0) {
    return items.length - 1;
  }

  return previousNaturalIndex;
}

/**
 * This hook allows 'getting next value' of an array with a simple callback.
 *
 * It's useful for UI cases where you go to next option by clicking previous one, eg video playback speed.
 */
export function getPreviousItemInArray<T>(items: T[], activeItem: T, { keyGetter, loop }: ArrayLoopConfig<T> = {}) {
  const activeItemIndex = items.findIndex((item) => {
    if (keyGetter) {
      return keyGetter(activeItem) === keyGetter(item);
    }
    return item === activeItem;
  });

  if (activeItemIndex === 0 && !loop) return null;

  const previousIndex = getPreviousIndexInArray(items, activeItemIndex);

  const previousItem = items[previousIndex];

  return previousItem;
}

/*
 * Creates a new array with the given item inserted at the given index into the array
 */
export function insertAtIndexIntoArray<T>(items: T[], item: T, index: number) {
  return [...items.slice(0, index), item, ...items.slice(index)];
}

export function getArrayIncludesEqual<T>(items: T[], itemToCheck: T) {
  return items.some((existingItem) => isEqual(existingItem, itemToCheck));
}

export function flattenWithDivider<T, D>(input: T[][], dividerGetter: () => D): Array<T | D> {
  return input.reduce((result, nextBatch, index) => {
    const isLastItem = index === input.length - 1;

    result.push(...nextBatch);

    if (!isLastItem) {
      result.push(dividerGetter());
    }

    return result;
  }, [] as Array<T | D>);
}

/**
 * Applies function to elements of the given array and returns the first non-none result
 * @see None
 */
export function findAndMap<I, R>(
  input: I[],
  finderAndMapper: (item: I, index: number) => R | typeof None
): R | undefined {
  for (let i = 0; i < input.length; i++) {
    const item = input[i];
    const result = finderAndMapper(item, i);
    if (result !== None) {
      return result;
    }
  }
}

export function sortArrayBySortList<I, S>(input: I[], sortItemGetter: (item: I) => S, sortList: S[]): I[] {
  return sortBy(input, (item) => {
    const sortItem = sortItemGetter(item);
    const sortIndex = sortList.indexOf(sortItem);

    if (sortIndex === -1) return Number.MAX_SAFE_INTEGER;

    return -sortIndex;
  }).reverse();
}

export function toggleElementInArray<T>(array: T[], item: T) {
  if (array.includes(item)) {
    removeElementFromArray(array, item);
    return false;
  } else {
    array.push(item);
    return true;
  }
}

export function getArrayWithElementToggled<T>(array: T[], item: T) {
  if (array.includes(item)) {
    return array.filter((existing) => existing !== item);
  } else {
    return [...array, item];
  }
}

interface NeigbourAwareIteration<T> {
  item: T;
  previous: T | null;
  next: T | null;
  index: number;
}

export function createArrayNeighbourList<T>(array: T[]): NeigbourAwareIteration<T>[] {
  return array.map((item, index) => {
    return { index, item: array[index], previous: array[index - 1] ?? null, next: array[index + 1] ?? null };
  });
}

export function pushElement<T>(list: T[], item: T) {
  list.push(item);

  return () => {
    removeElementFromArray(list, item);
  };
}

export function unshiftElement<T>(list: T[], item: T) {
  list.unshift(item);

  return () => {
    removeElementFromArray(list, item);
  };
}

export function areArraysShallowEqual<T>(a: T[], b: T[]) {
  if (a === b) return true;

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (!Array.isArray(a)) return false;

  if (a.length !== b.length) return false;

  return a.every((item, index) => item === b[index]);
}

/**
 * Optimized way to pick items that are present in both arrays
 */
export function getArraysCommonPart<T extends object>(itemsA: T[], itemsB: T[]) {
  // Use weekset as it has O(1) .has call cost
  const weakA = new WeakSet(itemsA);
  const weakB = new WeakSet(itemsB);

  const results: T[] = [];

  // Iterate on shorter array when comparing
  if (itemsA.length > itemsB.length) {
    for (const itemB of itemsB) {
      if (weakA.has(itemB)) results.push(itemB);
    }
  } else {
    for (const itemA of itemsA) {
      if (weakB.has(itemA)) results.push(itemA);
    }
  }

  return results;
}
