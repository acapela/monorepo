import React, { useRef } from "react";
import styled, { css } from "styled-components";
import { useCombobox } from "downshift";
import { LIGHT_GRAY } from "~ui/colors";
import { hoverActionCss } from "~ui/transitions";
import { SpaceBasicInfoFragment } from "~gql";
import { FieldLabel, SecondaryText } from "~ui/typo";
import { UIFormField } from "./UIFormField";
import { IconCheckCircle, IconChevronDown } from "~ui/icons";
import { ACTION_ACTIVE_COLOR } from "~ui/transitions";

interface Props {
  items: SpaceBasicInfoFragment[];
  onChange: (itemId: string) => void;
}

export const SpacesCombobox = ({ items, onChange }: Props) => {
  const {
    isOpen,
    selectedItem,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    openMenu,
    getLabelProps,
  } = useCombobox({
    items,
    defaultHighlightedIndex: 0,
    itemToString: (item) => item?.name || "",
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        onChange(selectedItem.id);
      }
    },
  });

  const comboboxRef = useRef<HTMLDivElement | null>(null);
  let menuMaxHeight;
  if (comboboxRef.current) {
    const { bottom, height } = comboboxRef.current.getBoundingClientRect();
    menuMaxHeight = bottom - height - 20;
  }

  return (
    <UIFormField {...getComboboxProps()}>
      <FieldLabel {...getLabelProps()}>Select space</FieldLabel>
      <UICombobox ref={comboboxRef}>
        <UIMenuOpener
          placeholder="Select space"
          {...getInputProps()}
          onFocus={() => {
            if (!isOpen) {
              openMenu();
            }
          }}
        />
        <UIMenuOpenerIconWr>
          <IconChevronDown />
        </UIMenuOpenerIconWr>
        <UIMenu style={{ maxHeight: menuMaxHeight }} {...getMenuProps()} isVisible={isOpen}>
          {isOpen &&
            items.map((item, index) => (
              <UIOption key={item.id} isHighlighted={highlightedIndex === index} {...getItemProps({ item, index })}>
                <SecondaryText>{item.name}</SecondaryText>
                {item.id === selectedItem?.id && <IconCheckCircle />}
              </UIOption>
            ))}
        </UIMenu>
      </UICombobox>
    </UIFormField>
  );
};

const UICombobox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const UIMenuOpenerIconWr = styled.div`
  position: absolute;
  right: 16px;
`;

const UIMenuOpener = styled.input`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${hoverActionCss}
  padding: 8px 16px;
  cursor: pointer;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid ${LIGHT_GRAY};
  text-align: start;
`;

const UIMenu = styled.div<{ isVisible: boolean }>`
  position: absolute;
  overflow-y: auto;
  border: 1px solid ${LIGHT_GRAY};
  left: 0;
  top: 0;
  width: 100%;
  visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")};
  border-radius: 6px;
  background: #ffffff;
`;

const UIOption = styled.div<{ isHighlighted: boolean }>`
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 42px;
  border-bottom: 1px solid ${LIGHT_GRAY};
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-radius: 0;
  ${(p) =>
    p.isHighlighted &&
    css`
      background-color: ${ACTION_ACTIVE_COLOR};
    `}
  :last-child {
    border-bottom: none;
  }
`;
