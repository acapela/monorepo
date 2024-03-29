import { useStateList } from "react-use";

import { useShortcut } from "@aca/ui/keyboard/useShortcut";

interface UseListWithNavigationConfig {
  enableKeyboard: boolean;
}

/**
 * Creates a hook that manages any list and allows having one of list items active.
 *
 * It also supports having keyboard navigation with up/down arrows. It is useful in UI components that allow picking
 * items with keyboard.
 */
export function useListWithNavigation<I>(items: I[], config?: UseListWithNavigationConfig) {
  const { state: activeItem = items[0], prev, next, currentIndex, setState: setActiveItem } = useStateList(items);
  const isKeyboardEnabled = config?.enableKeyboard ?? false;

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === items.length - 1;

  useShortcut("Down", next, { isEnabled: isKeyboardEnabled && !isLast, allowFocusedInput: true });
  useShortcut("Up", prev, { isEnabled: isKeyboardEnabled && !isFirst, allowFocusedInput: true });

  return {
    activeItem,
    items,
    prev,
    next,
    currentIndex,
    setActiveItem,
  };
}
