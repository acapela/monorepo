import { reaction } from "mobx";

function getItemsChanges<T>(itemsNow: T[], itemsBefore: T[]) {
  const addedItems: T[] = [];
  const removedItems: T[] = [];

  for (const itemNow of itemsNow) {
    if (!itemsBefore.includes(itemNow)) {
      addedItems.push(itemNow);
    }
  }

  for (const itemBefore of itemsBefore) {
    if (!itemsNow.includes(itemBefore)) {
      removedItems.push(itemBefore);
    }
  }

  return {
    addedItems,
    removedItems,
  };
}

export function watchArrayChanges<T>(getter: () => T[], callback: (addedItems: T[], removedItems: T[]) => void) {
  const stop = reaction(
    () => {
      const items = getter();
      // Inform reaction to re-run on items array changes
      items.length;

      return items;
    },
    (itemsNow, itemsBefore = []) => {
      const { addedItems, removedItems } = getItemsChanges(itemsNow, itemsBefore);

      callback(addedItems, removedItems);
    },
    { fireImmediately: true }
  );

  return () => {
    stop();
  };
}
