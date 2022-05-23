export function insertItemAtIndex<T>(items: T[], item: T, index: number) {
  return [...items.slice(0, index), item, ...items.slice(index)];
}

export function insertItemsAtIndex<T>(items: T[], itemsToAdd: T[], index: number) {
  return [...items.slice(0, index), ...itemsToAdd, ...items.slice(index)];
}
