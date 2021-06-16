export function groupByFilter<T>(inputList: T[], filter: (item: T) => boolean) {
  const acceptedItems: T[] = [];

  const rejectedItems: T[] = [];

  for (const item of inputList) {
    const isPassing = filter(item);

    if (isPassing) {
      acceptedItems.push(item);
    } else {
      rejectedItems.push(item);
    }
  }

  return [acceptedItems, rejectedItems] as const;
}
