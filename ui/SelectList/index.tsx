import { ReactNode } from "react";
import styled from "styled-components";

import { useListWithNavigation } from "~shared/hooks/useListWithNavigation";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { theme } from "~ui/theme";

interface Props<T> {
  items: T[];
  noItemsPlaceholder?: ReactNode;
  keyGetter: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  onItemSelected: (item: T) => void;
  className?: string;
}

export function SelectList<T>({ items, keyGetter, renderItem, onItemSelected, noItemsPlaceholder }: Props<T>) {
  const { activeItem } = useListWithNavigation(items, { enableKeyboard: true });

  const activeKey = activeItem ? keyGetter(activeItem) : null;

  useShortcut("Enter", () => {
    if (!activeItem) return;

    onItemSelected(activeItem);

    // If item is selected, mark event as handled preventing other shortcut handlers from reaching it.
    return true;
  });

  // Prevents bubbling up of arrow key to parent container, used to prevent cursor in tip-tap editor from moving
  // when ItemDropdown created from tip-tap node.
  useShortcut("ArrowUp", () => true);
  useShortcut("ArrowDown", () => true);

  return (
    <UIHolder role="listbox">
      {!items.length && noItemsPlaceholder}
      {items.map((item) => {
        const key = keyGetter(item);
        const isActive = activeKey === key;
        return (
          <UIItem role="option" isActive={isActive} onClick={() => onItemSelected(item)} key={key}>
            {renderItem(item)}
          </UIItem>
        );
      })}
    </UIHolder>
  );
}

const UIHolder = styled.div<{}>`
  display: flex;
  flex-direction: column;
  min-width: 15rem;
  padding: 0.5rem 0;

  ${theme.colors.layout.background.withBorder.asBgWithReadableText};

  box-sizing: border-box;
  ${theme.shadow.modal};
  ${theme.radius.panel};
`;

const UIItem = styled.div<{ isActive: boolean }>`
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  cursor: pointer;

  ${theme.colors.layout.background.interactive};

  ${theme.transitions.hover()}

  ${(props) => props.isActive && theme.colors.layout.background.hover.asBg};

  border-radius: 0;
`;
