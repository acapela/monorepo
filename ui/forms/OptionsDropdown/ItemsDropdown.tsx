import React, { ReactNode, useRef } from "react";
import { useClickAway } from "react-use";
import styled from "styled-components";
import { useListWithNavigation } from "~shared/hooks/useListWithNavigation";
import { borderRadius, shadow } from "~ui/baseStyles";
import { BACKGROUND_ACCENT } from "~ui/colors";
import { PopPresenceAnimator } from "~ui/animations";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { DropdownItem } from "./DropdownItem";

interface Props<I> {
  items: I[];
  selectedItems: I[];
  keyGetter: (item: I) => string;
  labelGetter: (item: I) => string;
  iconGetter?: (item: I) => ReactNode;
  onItemSelected: (item: I) => void;
  onCloseRequest?: () => void;
  additionalContent?: ReactNode;
}

export function ItemsDropdown<I>({
  items,
  selectedItems,
  keyGetter,
  labelGetter,
  onItemSelected,
  onCloseRequest,
  iconGetter,
  additionalContent,
}: Props<I>) {
  const { activeItem: highlightedItem, setActiveItem: setHighlightedItem } = useListWithNavigation(items, {
    enableKeyboard: true,
  });
  const menuRef = useRef<HTMLDivElement>(null);
  const selectedItemsKeys = selectedItems.map(keyGetter);

  function getIsItemSelected(item: I) {
    return selectedItemsKeys.includes(keyGetter(item));
  }

  useShortcut("Enter", () => {
    onItemSelected(highlightedItem);
  });

  useClickAway(menuRef, () => {
    onCloseRequest?.();
  });

  return (
    <UIMenu ref={menuRef}>
      {items.map((item) => {
        const itemKey = keyGetter(item);
        const isSelected = getIsItemSelected(item);
        const isHighlighted = keyGetter(highlightedItem) === itemKey;
        return (
          <DropdownItem
            key={itemKey}
            onClick={() => {
              onItemSelected(item);
            }}
            onHighlightRequest={() => setHighlightedItem(item)}
            isHighlighted={isHighlighted}
            isSelected={isSelected}
            icon={iconGetter?.(item)}
            label={labelGetter(item)}
          />
        );
      })}
      {additionalContent}
    </UIMenu>
  );
}

const UIMenu = styled(PopPresenceAnimator)`
  overflow-y: auto;
  border: 1px solid ${BACKGROUND_ACCENT};
  width: 100%;
  padding: 12px;
  ${borderRadius.menu};
  background: #ffffff;
  ${shadow.popover}

  ${DropdownItem} {
    &:not(:last-child) {
      margin-bottom: 4px;
    }
  }
`;
