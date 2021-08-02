import { useState } from "react";

interface Props<T> {
  originalList: Array<T>;
  minimizedLimit: number;
  isInitiallyExpanded?: boolean;
}

interface Result<T> {
  result: Array<T>;
  isExpandable: boolean;
  isExpanded: boolean;
  itemsNotShown: number;
  toggle: () => void;
}

const NO_LIMIT = Number.POSITIVE_INFINITY;

export function useExpandableListToggle<T>({
  originalList,
  minimizedLimit,
  isInitiallyExpanded = false,
}: Props<T>): Result<T> {
  const [shownListLimit, setShownListLimit] = useState(isInitiallyExpanded ? NO_LIMIT : minimizedLimit);

  function toggle() {
    setShownListLimit((limit) => (limit === minimizedLimit ? NO_LIMIT : minimizedLimit));
  }

  const isExpandable = originalList.length > minimizedLimit;
  const isExpanded = shownListLimit === NO_LIMIT;

  return {
    result: originalList.slice(0, shownListLimit),
    itemsNotShown: isExpanded || !isExpandable ? 0 : originalList.length - minimizedLimit,
    isExpandable,
    isExpanded,
    toggle,
  };
}
