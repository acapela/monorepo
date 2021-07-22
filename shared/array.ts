import { reverse } from "lodash";

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

/**
 * This function will grab an array of functions,invert their order of execution, and call each function.
 * It takes an optional predicate that allows it to prevent flipping the execution order.
 *
 */
export function flipExecutionOrder<R>(toExecute: Array<() => R>, preventFlip?: boolean): R[] {
  const inCorrectOrder = preventFlip ? toExecute : reverse(toExecute);
  return inCorrectOrder.map((fn: () => R) => fn());
}
