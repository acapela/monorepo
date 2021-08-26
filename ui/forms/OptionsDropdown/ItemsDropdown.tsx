import React, { ReactNode, useRef } from "react";
import { useClickAway, useWindowSize } from "react-use";
import styled, { css } from "styled-components";

import { useBoundingBox } from "~shared/hooks/useBoundingBox";
import { useListWithNavigation } from "~shared/hooks/useListWithNavigation";
import { PopPresenceAnimator } from "~ui/animations";
import { borderRadius, shadow } from "~ui/baseStyles";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { BACKGROUND_ACCENT } from "~ui/theme/colors/base";

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

  const { height: windowHeight } = useWindowSize();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuBoundingBox = useBoundingBox(menuRef);

  const selectedItemsKeys = selectedItems.map(keyGetter);

  function getIsItemSelected(item: I) {
    return selectedItemsKeys.includes(keyGetter(item));
  }

  useShortcut("Enter", () => {
    onItemSelected(highlightedItem);

    // If item is selected, mark event as handled preventing other shortcut handlers from reaching it.
    return true;
  });

  useClickAway(menuRef, () => {
    onCloseRequest?.();
  });

  const maxHeight = windowHeight - menuBoundingBox.top - 20;

  return (
    <UIMenu maxHeight={maxHeight} ref={menuRef}>
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

const UIMenu = styled(PopPresenceAnimator)<{ maxHeight?: number }>`
  ${({ maxHeight }) =>
    maxHeight &&
    css`
      max-height: ${maxHeight}px;
    `}
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
