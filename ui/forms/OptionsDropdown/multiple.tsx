import { AnimatePresence } from "framer-motion";
import React, { ReactNode, useRef } from "react";
import styled, { css } from "styled-components";
import { useBoolean } from "~shared/hooks/useBoolean";
import { useBoundingBox } from "~shared/hooks/useBoundingBox";
import { borderRadius } from "~ui/baseStyles";
import { BACKGROUND_ACCENT } from "~ui/colors";
import { IconChevronDown, IconPlus } from "~ui/icons";
import { ACTION_ACTIVE_COLOR, hoverActionCss } from "~ui/transitions";
import { SecondaryText } from "~ui/typo";
import { Popover } from "../../popovers/Popover";
import { FieldWithName } from "../FieldWithName";
import { DropdownItem } from "./DropdownItem";
import { ItemsDropdown } from "./ItemsDropdown";

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
  const openerRef = useRef<HTMLButtonElement>(null);
  const [isOpened, { set: open, unset: close, toggle }] = useBoolean(false);
  const selectedKeys = selectedItems.map(keyGetter);

  function handleItemPicked(pickedItem: I) {
    if (closeAfterItemPicked) {
      close();
    }

    const pickedItemKey = keyGetter(pickedItem);

    const wasSelected = selectedKeys.includes(pickedItemKey);

    console.log({ wasSelected });

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

  async function handleCreateNewRequest() {
    close();
  }

  const { width: menuOpenerWidth } = useBoundingBox(openerRef);

  return (
    <FieldWithName label={name} onLabelClick={toggle}>
      <UIHolder>
        <UIMenuOpener ref={openerRef} type="button" onClick={toggle}>
          <SecondaryText>
            {selectedItems.length > 0 && selectedItemsPreviewRenderer?.(selectedItems)}
            {selectedItems.length === 0 && placeholder}
          </SecondaryText>
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
`;

const UIMenuOpener = styled.button`
  outline: none;
  height: 100%;
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

  svg {
    font-size: 24px;
  }
`;

const UIDropdownHolder = styled.div``;

const UIMenu = styled.div<{ isVisible: boolean }>`
  position: absolute;
  overflow-y: auto;
  border: 1px solid ${BACKGROUND_ACCENT};
  left: 0;
  top: 0;
  width: 100%;
  visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")};
  border-radius: ${borderRadius.menu};
  background: #ffffff;
`;

const UIOption = styled.div<{ isHighlighted: boolean }>`
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  ${(props) =>
    props.isHighlighted &&
    css`
      background-color: ${ACTION_ACTIVE_COLOR};
    `}
`;
