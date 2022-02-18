import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React, { ReactNode, useRef } from "react";
import styled from "styled-components";

import { useBoolean } from "@aca/shared/hooks/useBoolean";
import { FieldWithLabel } from "@aca/ui/forms/FieldWithLabel";
import { IconPlus } from "@aca/ui/icons";
import { Popover } from "@aca/ui/popovers/Popover";
import { theme } from "@aca/ui/theme";

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

export const MultipleOptionsDropdown = observer(function MultipleOptionsDropdown<I>({
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
  placeholder,
}: Props<I>) {
  const openerRef = useRef<HTMLDivElement>(null);
  const [isOpen, { unset: close, set: open }] = useBoolean(false);
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

  return (
    <>
      <FieldWithLabel
        isDisabled={isDisabled}
        label={name}
        onClick={open}
        pushLabel={hasSelection}
        icon={icon}
        indicateDropdown
        cursorType="action"
        ref={openerRef}
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

              {!selectedItems.length && <SelectedOptionPreview label={placeholder ?? "Select..."} />}
            </UISelectedItemsPreview>
          </UIMenuOpener>
        </UIHolder>
      </FieldWithLabel>
      <AnimatePresence>
        {isOpen && (
          <Popover anchorRef={openerRef} placement="bottom-start" onCloseRequest={close} enableScreenCover>
            <UIDropdownHolder role="listbox">
              <ItemsDropdown
                items={items}
                keyGetter={keyGetter}
                labelGetter={labelGetter}
                onItemSelected={handleItemPicked}
                selectedItems={selectedItems}
                onCloseRequest={() => {
                  close();
                }}
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
    </>
  );
});

const UIHolder = styled.div<{}>`
  position: relative;
  min-width: 0;
  display: flex;
  flex-grow: 1;
  ${theme.common.clickable};
`;

const UIMenuOpener = styled.div<{}>`
  min-height: 42px;
  display: flex;
`;

const UIDropdownHolder = styled.div<{}>`
  min-width: 150px;
`;

const UISelectedItemsPreview = styled.div<{}>`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  grid-gap: 8px;
  flex-direction: column;
  padding: 8px 0;
`;
