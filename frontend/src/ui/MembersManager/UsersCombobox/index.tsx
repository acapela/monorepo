import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { useCombobox } from "downshift";
import { UserBasicInfoFragment } from "~gql";
import { baseInputStyles } from "~ui/forms/utils";
import { Button } from "~ui/buttons/Button";
import { UserBasicInfo } from "~frontend/ui/users/UserBasicInfo";
import { ACTION_ACTIVE_COLOR } from "~ui/transitions";
import { BACKGROUND_ACCENT } from "~ui/colors";
import { IconPlusSquare } from "~ui/icons";
import { useShortcut } from "~ui/keyboard/useShortcut";

interface Props {
  users: UserBasicInfoFragment[];
  onSelect: (userId: string) => void;
}

export const UsersCombobox = ({ users, onSelect }: Props) => {
  const [inputItems, setInputItems] = useState(users);

  const handleInputChange = (inputValue: string | undefined) => {
    const lowerCaseInputValue = (inputValue || "").toLowerCase();
    const newItems = users.filter((user) => {
      const joinedFields = [user.email, user.name].join("").toLowerCase();
      return joinedFields.includes(lowerCaseInputValue);
    });
    setInputItems(newItems);
  };

  const {
    isOpen,
    selectedItem,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    openMenu,
    reset,
    inputValue,
  } = useCombobox({
    items: inputItems,
    defaultHighlightedIndex: 0,
    onInputValueChange: ({ inputValue }) => handleInputChange(inputValue),
    itemToString: (user) => user?.email || "",
  });

  useEffect(() => {
    handleInputChange(inputValue);
  }, [users]);

  const areResultsVisible = isOpen && inputItems.length > 0;

  const comboboxRef = useRef<HTMLDivElement | null>(null);
  let menuMaxHeight;
  if (comboboxRef.current) {
    menuMaxHeight = comboboxRef.current.getBoundingClientRect().bottom - 20;
  }

  const handleSubmit = () => {
    if (selectedItem) {
      onSelect(selectedItem.id);
      reset();
    }
  };
  useShortcut("Enter", handleSubmit);

  return (
    <UIForm {...getComboboxProps()}>
      <UICombobox ref={comboboxRef}>
        <UIInput
          areResultsVisible={areResultsVisible}
          onFocus={() => {
            if (!isOpen) {
              openMenu();
            }
          }}
          placeholder="Search with name or email"
          {...getInputProps()}
        />
        <UIMenu style={{ maxHeight: menuMaxHeight }} {...getMenuProps()} isVisible={areResultsVisible}>
          {areResultsVisible &&
            inputItems.map((user, index) => (
              <UIOption
                key={user.id}
                isHighlighted={highlightedIndex === index}
                {...getItemProps({ item: user, index })}
              >
                <UserBasicInfo user={user} />
              </UIOption>
            ))}
        </UIMenu>
      </UICombobox>
      <Button iconPosition="start" icon={<IconPlusSquare />} onClick={handleSubmit} isDisabled={!selectedItem}>
        Add member
      </Button>
    </UIForm>
  );
};

const UIForm = styled.form`
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
`;

const UICombobox = styled.div`
  position: relative;
`;

const UIInput = styled.input<{ areResultsVisible: boolean }>`
  ${baseInputStyles}
  height: 42px;
  width: 100%;
  ${(props) =>
    props.areResultsVisible &&
    css`
      border-bottom-color: transparent;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    `}
`;

const UIMenu = styled.div<{ isVisible: boolean }>`
  position: absolute;
  overflow-y: auto;
  border-left: 1px solid ${BACKGROUND_ACCENT};
  border-right: 1px solid ${BACKGROUND_ACCENT};
  border-bottom: 1px solid ${BACKGROUND_ACCENT};
  left: 0;
  width: 100%;
  visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")};
  border-radius: 0 0 16px 16px;
  background: #ffffff;
`;

const UIOption = styled.div<{ isHighlighted: boolean }>`
  padding: 16px;
  border-bottom: 1px solid ${BACKGROUND_ACCENT};
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-radius: 0;
  ${(props) =>
    props.isHighlighted &&
    css`
      background-color: ${ACTION_ACTIVE_COLOR};
    `}
  :last-child {
    border-bottom: none;
  }
`;
