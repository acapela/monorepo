import { AnimatePresence } from "framer-motion";
import React, { ReactNode, useRef } from "react";
import styled from "styled-components";

import { useBoolean } from "~shared/hooks/useBoolean";
import { useBoundingBox } from "~shared/hooks/useBoundingBox";
import { FieldWithLabel } from "~ui/forms/FieldWithLabel";
import { IconPlus } from "~ui/icons";
import { Popover } from "~ui/popovers/Popover";

import { DropdownItem } from "./DropdownItem";
import { ItemsDropdown } from "./ItemsDropdown";
import { SelectedOptionPreview } from "./SelectedOptionPreview";

interface Props<I> {
  name?: string;
  items: I[];
  selectedItems: I[];
  keyGetter: (item: I) => string;
  labelGetter: (item: I) => string;
  iconGetter?: (item: I) => ReactNode;
  onChange?: (items: I[]) => void;
  onItemSelected?: (item: I) => void;
  onItemUnselected?: (item: I) => void;
  newItem?: {
    onCreateRequest: () => void;
    label: string;
  };
  placeholder?: string;
  selectedItemsPreviewRenderer?: (items: I[]) => ReactNode;
  closeAfterItemPicked?: boolean;
  icon?: ReactNode;
  isDisabled?: boolean;
}

export function MultipleOptionsDropdown<I>({
  name,
  items,
  selectedItems,
  keyGetter,
  labelGetter,
  iconGetter,
  newItem,
  onChange,
  onItemSelected,
  onItemUnselected,
  closeAfterItemPicked,
  selectedItemsPreviewRenderer,
  icon,
  isDisabled,
}: Props<I>) {
  const openerRef = useRef<HTMLDivElement>(null);
  const [isOpen, { unset: close, toggle }] = useBoolean(false);
  const selectedKeys = selectedItems.map(keyGetter);

  const hasSelection = selectedKeys.length > 0;

  function handleItemPicked(pickedItem: I) {
    if (closeAfterItemPicked) {
      close();
    }

    const pickedItemKey = keyGetter(pickedItem);

    const wasSelected = selectedKeys.includes(pickedItemKey);

    if (wasSelected) {
      const newSelectedItems = selectedItems.filter((selectedItem) => {
        return keyGetter(selectedItem) !== pickedItemKey;
      });

      onItemUnselected?.(pickedItem);
      onChange?.(newSelectedItems);
      return;
    }

    const newSelectedItems = [...selectedItems, pickedItem];

    onItemSelected?.(pickedItem);
    onChange?.(newSelectedItems);
  }

  const { width: menuOpenerWidth } = useBoundingBox(openerRef);

  return (
    <FieldWithLabel
      isDisabled={isDisabled}
      ref={openerRef}
      label={name}
      onClick={toggle}
      pushLabel={hasSelection}
      icon={icon}
      indicateDropdown
    >
      <UIHolder>
        <UIMenuOpener>
          <UISelectedItemsPreview>
            {selectedItemsPreviewRenderer && selectedItemsPreviewRenderer(selectedItems)}
            {!selectedItemsPreviewRenderer &&
              selectedItems.map((selectedItem) => {
                const key = keyGetter(selectedItem);
                const label = labelGetter(selectedItem);
                return <SelectedOptionPreview key={key} label={label} icon={iconGetter?.(selectedItem)} />;
              })}
          </UISelectedItemsPreview>
        </UIMenuOpener>
        <AnimatePresence>
          {isOpen && (
            <Popover anchorRef={openerRef} placement="bottom-start">
              <UIDropdownHolder role="listbox" style={{ width: `${menuOpenerWidth}px` }}>
                <ItemsDropdown
                  items={items}
                  keyGetter={keyGetter}
                  labelGetter={labelGetter}
                  onItemSelected={handleItemPicked}
                  selectedItems={selectedItems}
                  onCloseRequest={close}
                  iconGetter={iconGetter}
                  additionalContent={
                    newItem && (
                      <DropdownItem
                        icon={<IconPlus />}
                        label={newItem.label}
                        onClick={() => {
                          close();
                          newItem.onCreateRequest();
                        }}
                      />
                    )
                  }
                />
              </UIDropdownHolder>
            </Popover>
          )}
        </AnimatePresence>
      </UIHolder>
    </FieldWithLabel>
  );
}

const UIHolder = styled.div<{}>`
  position: relative;
  min-width: 0;
  display: flex;
  flex-grow: 1;
  cursor: pointer;
`;

const UIMenuOpener = styled.div<{}>`
  padding: 12px 0;
  display: flex;
`;

const UIDropdownHolder = styled.div<{}>``;

const UISelectedItemsPreview = styled.div<{}>`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  grid-gap: 8px;
`;
