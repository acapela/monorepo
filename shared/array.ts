export function removeElementFromArray<T>(arr: T[], element: T) {
  const index = arr.indexOf(element);
  if (index > -1) {
    arr.splice(index, 1);
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
    .reduce((nextCharNumber, buffer) => nextCharNumber * buffer, 1);

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
