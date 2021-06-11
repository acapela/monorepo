import React, { useState } from "react";
import styled, { css } from "styled-components";
import { useCombobox } from "downshift";
import { UserBasicInfoFragment } from "~frontend/gql";
import { baseInputStyles } from "~ui/forms/utils";
import { Button } from "~ui/buttons/Button";
import { UserMedia } from "~frontend/ui/users/UserMedia";
import { ACTION_ACTIVE_COLOR } from "~ui/transitions";

interface Props {
  users: UserBasicInfoFragment[];
  onSelect: (userId: string) => void;
}

export const UsersCombobox = ({ users, onSelect }: Props) => {
  const [inputItems, setInputItems] = useState(users);
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
  } = useCombobox({
    items: users,
    defaultHighlightedIndex: 0,
    onInputValueChange: ({ inputValue }) => {
      const lowerCaseInputValue = (inputValue || "").toLowerCase();
      const newItems = users.filter((user) => {
        const joinedFields = [user.email, user.name].join("").toLowerCase();
        return joinedFields.includes(lowerCaseInputValue);
      });
      setInputItems(newItems);
    },
    itemToString: (user) => user?.email || "",
  });
  const areResultsVisible = isOpen && inputItems.length > 0;
  return (
    <UIForm
      onSubmit={(event) => {
        event.preventDefault();
        if (selectedItem) {
          onSelect(selectedItem.id);
          reset();
        }
      }}
      {...getComboboxProps()}
    >
      <UICombobox>
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
        <UIMenu {...getMenuProps()} isOpen={isOpen}>
          {areResultsVisible &&
            inputItems.map((user, index) => (
              <UIOption
                key={user.id}
                isHighlighted={highlightedIndex === index}
                {...getItemProps({ item: user, index })}
              >
                <UserMedia user={user} />
              </UIOption>
            ))}
        </UIMenu>
      </UICombobox>
      <Button onClick={() => null} isDisabled={!selectedItem}>
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

const UIMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  overflow: hidden;
  border-left: 1px solid #eae9ea;
  border-right: 1px solid #eae9ea;
  border-bottom: 1px solid #eae9ea;
  left: 0;
  width: 100%;
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  border-radius: 0 0 16px 16px;
  background: #ffffff;
`;

const UIOption = styled.div<{ isHighlighted: boolean }>`
  padding: 16px;
  border-bottom: 1px solid #eae9ea;
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
