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
