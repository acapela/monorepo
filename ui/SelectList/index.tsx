import { observer } from "mobx-react";
import { ReactNode } from "react";
import styled from "styled-components";

import { useListWithNavigation } from "@aca/shared/hooks/useListWithNavigation";
import { useShortcut } from "@aca/ui/keyboard/useShortcut";
import { theme } from "@aca/ui/theme";

interface Props<T> {
  items: T[];
  noItemsPlaceholder?: ReactNode;
  keyGetter: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  onItemSelected: (item: T) => void;
  className?: string;
}

export const SelectList = observer(function SelectList<T>({
  items,
  keyGetter,
  renderItem,
  onItemSelected,
  noItemsPlaceholder,
}: Props<T>) {
  const { activeItem, setActiveItem } = useListWithNavigation(items, { enableKeyboard: true });

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
      {!items.length && <UINoItems>{noItemsPlaceholder}</UINoItems>}
      {items.map((item) => {
        const key = keyGetter(item);
        const isActive = activeKey === key;
        return (
          <UIItem
            role="option"
            isActive={isActive}
            onMouseEnter={() => setActiveItem(item)}
            onMouseMove={() => setActiveItem(item)}
            onClick={() => onItemSelected(item)}
            key={key}
          >
            {renderItem(item)}
          </UIItem>
        );
      })}
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  display: flex;
  flex-direction: column;
  min-width: 15rem;
  padding: 5px 0;
  overflow: hidden;

  ${theme.colors.panels.popover.asBgWithReadableText};

  ${theme.shadow.modal};
  ${theme.radius.panel};
`;

const UIItem = styled.div<{ isActive: boolean }>`
  ${theme.box.items.selectItem.padding.radius.size};
  display: flex;
  align-items: center;
  cursor: pointer;

  ${theme.colors.panels.popover.interactive};

  ${theme.transitions.hover()}

  ${(props) => props.isActive && theme.colors.panels.popover.active.asBg};

  border-radius: 0;
`;

const UINoItems = styled.div`
  padding: 15px 0;
`;
