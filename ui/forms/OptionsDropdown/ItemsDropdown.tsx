import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useClickAway, useWindowSize } from "react-use";
import styled, { css } from "styled-components";

import { useBoundingBox } from "~shared/hooks/useBoundingBox";
import { useListWithNavigation } from "~shared/hooks/useListWithNavigation";
import { PopPresenceAnimator } from "~ui/animations";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { theme } from "~ui/theme";

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
  dividerIndexes?: number[];
  shouldScrollSelectedIntoView?: boolean;
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
  dividerIndexes,
  shouldScrollSelectedIntoView,
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

  // Prevents bubbling up of arrow key to parent container, used to prevent cursor in tip-tap editor from moving
  // when ItemDropdown created from tip-tap node.
  useShortcut("ArrowUp", () => true);
  useShortcut("ArrowDown", () => true);

  useClickAway(menuRef, () => {
    onCloseRequest?.();
  });

  const [firstSelectedItem, setFirstSelectedItem] = useState<{
    ref: React.RefObject<HTMLDivElement>;
    index: number;
  } | null>(null);

  useEffect(() => {
    if (shouldScrollSelectedIntoView && firstSelectedItem) {
      firstSelectedItem.ref.current?.scrollIntoView();
    }
  }, [shouldScrollSelectedIntoView, firstSelectedItem]);

  const maxHeight = windowHeight - menuBoundingBox.top - 20;

  return (
    <UIMenu $maxHeight={maxHeight} ref={menuRef}>
      {items.map((item, index) => {
        const itemKey = keyGetter(item);
        const isSelected = getIsItemSelected(item);
        const isHighlighted = keyGetter(highlightedItem) === itemKey;
        const ref = useRef<HTMLDivElement>(null);
        if (isSelected && (!firstSelectedItem || index < firstSelectedItem.index)) {
          setFirstSelectedItem({
            ref,
            index,
          });
        }
        return (
          <React.Fragment key={itemKey}>
            {dividerIndexes && dividerIndexes.includes(index) && <UIDivider />}
            <DropdownItem
              onClick={() => {
                onItemSelected(item);
              }}
              ref={ref}
              onHighlightRequest={() => setHighlightedItem(item)}
              isHighlighted={isHighlighted}
              isSelected={isSelected}
              icon={iconGetter?.(item)}
              label={labelGetter(item)}
            />
          </React.Fragment>
        );
      })}
      {additionalContent}
    </UIMenu>
  );
}

const UIMenu = styled(PopPresenceAnimator)<{ $maxHeight?: number }>`
  ${({ $maxHeight }) =>
    $maxHeight &&
    css`
      max-height: ${$maxHeight}px;
    `}
  overflow-y: auto;
  width: 100%;
  padding: 5px 0;
  ${theme.radius.panel};
  ${theme.colors.panels.popover.asBgWithReadableText};
  ${theme.shadow.popover};
`;

const UIDivider = styled.div<{}>`
  margin: 5px 0;
  background-color: rgba(255, 255, 255, 0.2);
  height: 1px;
  width: 100%;
`;
