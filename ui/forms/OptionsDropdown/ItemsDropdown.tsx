import React, { ReactNode, useRef, useState } from "react";
import { useClickAway, useWindowSize } from "react-use";
import styled, { css } from "styled-components";

import { fuzzySearch, useFuzzySearch } from "@aca/shared/fuzzy/fuzzySearch";
import { useBoundingBox } from "@aca/shared/hooks/useBoundingBox";
import { CANCEL_CLICK_OUTSIDE_CLASSNAME, useHandleCloseRequest } from "@aca/shared/hooks/useClickOutside";
import { useEqualDependencyChangeEffect } from "@aca/shared/hooks/useEqualEffect";
import { useListWithNavigation } from "@aca/shared/hooks/useListWithNavigation";
import { PopPresenceAnimator } from "@aca/ui/animations";
import { useShortcut } from "@aca/ui/keyboard/useShortcut";
import { theme } from "@aca/ui/theme";

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
}: Props<I>) {
  const [keyword, setKeyword] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const itemsToShow = useFuzzySearch(
    items,
    (item) => {
      return [labelGetter(item)];
    },
    keyword
  );

  const { activeItem: highlightedItem, setActiveItem: setHighlightedItem } = useListWithNavigation(itemsToShow, {
    enableKeyboard: true,
  });

  const { height: windowHeight } = useWindowSize();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuBoundingBox = useBoundingBox(menuRef);

  const selectedItemsKeys = selectedItems.map(keyGetter);

  useEqualDependencyChangeEffect(() => {
    searchInputRef.current?.focus();

    const areAllVisibleItemsSelectedNow = itemsToShow.every((visibleItem) => {
      return selectedItemsKeys.includes(keyGetter(visibleItem));
    });

    if (areAllVisibleItemsSelectedNow) {
      setKeyword("");
    }
  }, [selectedItemsKeys]);

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

  useHandleCloseRequest(menuRef, () => {
    onCloseRequest?.();
  });

  const maxHeight = windowHeight - menuBoundingBox.top - 20;

  return (
    <UIMenu $maxHeight={Math.min(maxHeight, 400)} ref={menuRef} className={CANCEL_CLICK_OUTSIDE_CLASSNAME}>
      <UISearch
        ref={searchInputRef}
        autoFocus
        placeholder="Find option..."
        value={keyword}
        onChange={(event) => {
          setKeyword(event.target.value);
        }}
      />
      <UIItems>
        {itemsToShow.map((item, index) => {
          const itemKey = keyGetter(item);
          const isSelected = getIsItemSelected(item);
          const isHighlighted = keyGetter(highlightedItem) === itemKey;

          return (
            <React.Fragment key={itemKey}>
              {dividerIndexes && dividerIndexes.includes(index) && <UIDivider />}
              <DropdownItem
                onClick={() => {
                  onItemSelected(item);
                }}
                onHighlightRequest={() => setHighlightedItem(item)}
                isHighlighted={isHighlighted}
                isSelected={isSelected}
                icon={iconGetter?.(item)}
                label={labelGetter(item)}
              />
            </React.Fragment>
          );
        })}
      </UIItems>

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

  width: 100%;
  padding: 5px 0;
  min-width: 220px;
  ${theme.radius.panel};
  ${theme.colors.panels.popover.asBgWithReadableText};
  ${theme.shadow.popover};
  display: flex;
  flex-direction: column;
`;

const UIItems = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const UIDivider = styled.div<{}>`
  margin: 5px 0;
  background-color: rgba(255, 255, 255, 0.2);
  height: 1px;
  width: 100%;
`;

const UISearch = styled.input`
  ${theme.common.transparentInput}
  ${theme.box.selectOption};
  padding-top: 15px;
  padding-bottom: 15px;
`;
