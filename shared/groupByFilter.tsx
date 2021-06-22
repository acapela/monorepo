export function groupByFilter<T>(inputList: T[], filter: (item: T, index: number) => boolean) {
  const acceptedItems: T[] = [];

  const rejectedItems: T[] = [];

  inputList.forEach((item, index) => {
    const isPassing = filter(item, index);

    if (isPassing) {
      acceptedItems.push(item);
    } else {
      rejectedItems.push(item);
    }
  });

  return [acceptedItems, rejectedItems] as const;
}
