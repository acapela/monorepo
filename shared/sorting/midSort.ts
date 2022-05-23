import { generateNKeysBetween } from "fractional-indexing";

function removeIncorrectlySorted(sorts: Array<string | undefined>) {
  let previousValue: string | undefined = undefined;

  return sorts.map((sort) => {
    if (previousValue === undefined) {
      previousValue = sort;
      return sort;
    }

    if (sort === undefined) return sort;

    if (sort > previousValue) {
      return sort;
    }

    return undefined;
  });
}

interface ItemWithNewSort<T> {
  item: T;
  sort: string;
  didChange: boolean;
}

export function createNewSorts<T>(items: T[], sortGetter: (item: T) => string | undefined): ItemWithNewSort<T>[] {
  const currentSorts = items.map(sortGetter);
  const currentCorrectSorts = removeIncorrectlySorted(currentSorts);

  const newSorts = fillGaps(currentCorrectSorts, (previousSort, nextSort, count) => {
    return generateNKeysBetween(previousSort ?? null, nextSort ?? null, count);
  });

  return newSorts.map((sort, index) => {
    const item = items[index];
    const previousSort = currentSorts[index];
    const didChange = sort === previousSort;

    return { item, didChange, sort };
  });
}

function fillGaps<I>(
  items: Array<I | undefined>,
  filler: (previousKnown: I | undefined, nextKnown: I | undefined, count: number) => I[]
): I[] {
  let previousKnown: I | undefined = undefined;
  let emptyBuffer: Array<undefined> = [];

  const output: I[] = [];

  for (const item of items) {
    if (item === undefined) {
      emptyBuffer.push(item as undefined);
      continue;
    }

    if (emptyBuffer.length > 0) {
      const resultsToFill = filler(previousKnown, item, emptyBuffer.length);
      output.push(...resultsToFill);
      emptyBuffer = [];
    }

    output.push(item);

    previousKnown = item;
  }

  if (emptyBuffer.length > 0) {
    const resultsToFill = filler(previousKnown, undefined, emptyBuffer.length);
    output.push(...resultsToFill);
  }

  return output;
}
