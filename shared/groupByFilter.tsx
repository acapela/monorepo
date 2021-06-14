export function groupByFilter<T>(inputList: T[], filter: (item: T) => boolean) {
  const passingItems: T[] = [];

  const notPassingItems: T[] = [];

  for (const item of inputList) {
    const isPassing = filter(item);

    if (isPassing) {
      passingItems.push(item);
    } else {
      notPassingItems.push(item);
    }
  }

  return [passingItems, notPassingItems] as const;
}
