interface UseListRollerInput<T> {
  items: T[];
  activeItem: T;
  onActiveItemChange: (item: T) => void;
}

function getNextIndex<T>(items: T[], currentIndex: number) {
  const nextNaturalIndex = currentIndex + 1;

  if (nextNaturalIndex >= items.length) {
    return 0;
  }

  return nextNaturalIndex;
}

export function useListRoller<T>({ items, activeItem, onActiveItemChange }: UseListRollerInput<T>) {
  const activeItemIndex = items.indexOf(activeItem);

  function setNextItem() {
    const nextIndex = getNextIndex(items, activeItemIndex);

    const nextItem = items[nextIndex];

    onActiveItemChange(nextItem);
  }

  return setNextItem;
}
