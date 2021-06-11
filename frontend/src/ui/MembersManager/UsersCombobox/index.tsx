import React, { useState } from "react";
import styled, { css } from "styled-components";
import { useCombobox } from "downshift";
import { UserBasicInfoFragment } from "~frontend/gql";
import { baseInputStyles } from "~frontend/../../ui/forms/utils";
import { Button } from "~frontend/../../ui/buttons/Button";
import { UserMedia } from "~frontend/ui/users/UserMedia";
import { hoverActionCss } from "~frontend/../../ui/transitions";

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
    setInputValue,
  } = useCombobox({
    items: users,
    onInputValueChange: ({ inputValue }) => {
      const lowerCaseInputValue = (inputValue || "").toLowerCase();
      const newItems = users.filter((user) => {
        const joinedFields = [user.email, user.name].join("");
        return joinedFields.includes(lowerCaseInputValue);
      });
      setInputItems(newItems);
    },
  });
  return (
    <UIForm
      onSubmit={(event) => {
        event.preventDefault();
        if (selectedItem) {
          onSelect(selectedItem.id);
          setInputValue("");
        }
      }}
      {...getComboboxProps()}
    >
      <UIInput placeholder="Search with name or email" {...getInputProps} />
      <Button isDisabled={!selectedItem}>Add member</Button>
      <UIMenu {...getMenuProps()} isOpen={isOpen}>
        {isOpen &&
          inputItems.length &&
          inputItems.map((user, index) => (
            <UIOption isHighlighted={highlightedIndex === index} {...getItemProps({ item: user, index })}>
              <UserMedia user={user} />
            </UIOption>
          ))}
      </UIMenu>
    </UIForm>
  );
};

const UIForm = styled.form`
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
`;

const UIInput = styled.input`
  ${baseInputStyles}
  height: 42px;
  width: 100%;
`;

const UIMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  bottom: 8px;
  left: 0;
  width: 100%;
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
`;

const UIOption = styled.div<{ isHighlighted: boolean }>`
  padding: 8px;
  border-bottom: 1px solid #eae9ea;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${hoverActionCss};
  ${(p) =>
    p.isHighlighted &&
    css`
      filter: saturate(1.2);
    `}
  :last-child {
    border-bottom: none;
  }
`;
