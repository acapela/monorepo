import { isEqual } from "lodash";

import { None } from "~shared/none";

export function removeElementFromArray<T>(arr: T[], element: T) {
  const index = arr.indexOf(element);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

export function removeElementsFromArrayByFilter<T>(arr: T[], filter: (item: T) => boolean) {
  for (const item of arr) {
    const shouldRemove = filter(item);

    if (shouldRemove) {
      removeElementFromArray(arr, item);
    }
  }
}

export function convertMaybeArrayToArray<T>(input: T | T[]): T[] {
  if (Array.isArray(input)) return input;

  return [input];
}

export function isLastItem<T>(array: T[], item: T) {
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

/**
 * This hook allows 'getting next value' of an array with a simple callback.
 *
 * It's useful for UI cases where you go to next option by clicking previous one, eg video playback speed.
 */
export function getNextItemInArray<T>(items: T[], activeItem: T) {
  const activeItemIndex = items.indexOf(activeItem);

  const nextIndex = getNextIndexInArray(items, activeItemIndex);

  const nextItem = items[nextIndex];

  return nextItem;
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
export function findAndMap<I, R>(input: I[], finderAndMapper: (item: I) => R | typeof None): R | undefined {
  for (const item of input) {
    const result = finderAndMapper(item);
    if (result !== None) {
      return result;
    }
  }
}
