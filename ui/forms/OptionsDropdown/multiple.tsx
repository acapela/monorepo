import { AnimatePresence } from "framer-motion";
import React, { ReactNode, useRef } from "react";
import styled from "styled-components";
import { useBoolean } from "~shared/hooks/useBoolean";
import { useBoundingBox } from "~shared/hooks/useBoundingBox";
import { borderRadius } from "~ui/baseStyles";
import { BACKGROUND_ACCENT } from "~ui/colors";
import { IconChevronDown, IconPlus } from "~ui/icons";
import { hoverActionCss } from "~ui/transitions";
import { SecondaryText } from "~ui/typo";
import { Popover } from "~ui/popovers/Popover";
import { FieldWithName } from "../FieldWithName";
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
}

export function MultipleOptionsDropdown<I>({
  name,
  items,
  selectedItems,
  keyGetter,
  labelGetter,
  iconGetter,
  newItem,
  placeholder,
  onChange,
  onItemSelected,
  onItemUnselected,
  closeAfterItemPicked,
  selectedItemsPreviewRenderer,
}: Props<I>) {
  const openerRef = useRef<HTMLDivElement>(null);
  const [isOpened, { unset: close, toggle }] = useBoolean(false);
  const selectedKeys = selectedItems.map(keyGetter);

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
    <FieldWithName label={name} onLabelClick={toggle}>
      <UIHolder>
        <UIMenuOpener ref={openerRef} onClick={toggle}>
          {selectedItems.length > 0 && (
            <UISelectedItemsPreview>
              {selectedItemsPreviewRenderer && selectedItemsPreviewRenderer(selectedItems)}
              {!selectedItemsPreviewRenderer &&
                selectedItems.map((selectedItem) => {
                  const key = keyGetter(selectedItem);
                  const label = labelGetter(selectedItem);
                  return <SelectedOptionPreview key={key} label={label} icon={iconGetter?.(selectedItem)} />;
                })}
            </UISelectedItemsPreview>
          )}
          {selectedItems.length === 0 && placeholder}

          <IconChevronDown />
        </UIMenuOpener>
        <AnimatePresence>
          {isOpened && (
            <Popover anchorRef={openerRef} placement="bottom-start">
              <UIDropdownHolder style={{ width: `${menuOpenerWidth}px` }}>
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
    </FieldWithName>
  );
}

const UIHolder = styled.div`
  position: relative;
  min-width: 0;
`;

const UIMenuOpener = styled.div`
  outline: none;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${hoverActionCss}
  padding: 8px 16px;
  cursor: pointer;
  background: #ffffff;
  border-radius: ${borderRadius.input};
  border: 1px solid ${BACKGROUND_ACCENT};
  text-align: start;
  min-width: 0;

  svg {
    font-size: 24px;
  }
`;

const UIDropdownHolder = styled.div``;

const UISelectedItemsPreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  grid-gap: 8px;
`;
