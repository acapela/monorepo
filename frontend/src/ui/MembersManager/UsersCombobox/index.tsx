import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useCombobox } from "downshift";
import { AnimatePresence } from "framer-motion";
import { UserBasicInfoFragment } from "~gql";
import { Button } from "~ui/buttons/Button";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { IconPlusSquare, IconSearch } from "~ui/icons";
import { RoundedTextInput } from "~ui/forms/RoundedTextInput";
import { useBoundingBox } from "~shared/hooks/useBoundingBox";
import { Popover } from "~ui/popovers/Popover";
import { ItemsDropdown } from "~ui/forms/OptionsDropdown/ItemsDropdown";
import { Avatar } from "~frontend/ui/users/Avatar";

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

  const { isOpen, selectedItem, getComboboxProps, getInputProps, openMenu, reset, inputValue, selectItem } =
    useCombobox({
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
  const isSubmitEnabled = Boolean(selectedItem);

  const handleSubmit = () => {
    if (!selectedItem) return;

    onSelect(selectedItem.id);
    reset();
  };

  useShortcut("Enter", handleSubmit, { isEnabled: isSubmitEnabled });

  const { width: comboboxWidth } = useBoundingBox(comboboxRef);

  return (
    <UIHolder>
      <UIComboboxHolder {...getComboboxProps()}>
        <UICombobox ref={comboboxRef}>
          <RoundedTextInput
            icon={<IconSearch />}
            onFocus={() => {
              if (!isOpen) {
                openMenu();
              }
            }}
            placeholder="Search or enter email"
            {...getInputProps()}
          />
          <AnimatePresence>
            {areResultsVisible && (
              <Popover anchorRef={comboboxRef} placement="bottom-start">
                <UIDropdownHolder style={{ width: `${comboboxWidth}px` }}>
                  <ItemsDropdown
                    items={inputItems}
                    keyGetter={(item) => item.id}
                    labelGetter={(item) => item.name || ""}
                    onItemSelected={selectItem}
                    selectedItems={selectedItem ? [selectedItem] : []}
                    onCloseRequest={close}
                    iconGetter={(item) => <Avatar size="small" url={item.avatar_url} />}
                  />
                </UIDropdownHolder>
              </Popover>
            )}
          </AnimatePresence>
        </UICombobox>
      </UIComboboxHolder>
      <Button iconPosition="start" icon={<IconPlusSquare />} onClick={handleSubmit} isDisabled={!isSubmitEnabled}>
        Add Member
      </Button>
    </UIHolder>
  );
};

const UIHolder = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
`;

const UIComboboxHolder = styled.div``;

const UIDropdownHolder = styled.div``;

const UICombobox = styled.div`
  position: relative;
`;
