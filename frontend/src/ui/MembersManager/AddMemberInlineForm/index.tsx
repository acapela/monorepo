import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
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
import { useBoolean } from "~frontend/../../shared/hooks/useBoolean";
import isEmail from "validator/lib/isEmail";

interface Props {
  users: UserBasicInfoFragment[];
  onSelect: (userId: string) => void;
}

export const AddMemberInlineForm = ({ users, onSelect }: Props) => {
  const [isMenuOpen, { set: openMenu, unset: closeMenu }] = useBoolean(false);

  const [suggestedUsers, setSuggestedUsers] = useState(users);

  const [inputValue, setInputValue] = useState("");

  const handleInputValueChange = (newInputValue: string) => {
    const lowerCaseInputValue = newInputValue.toLowerCase();
    const newSuggestedUsers = users.filter((user) => {
      const joinedFields = [user.email, user.name].join("").toLowerCase();
      return joinedFields.includes(lowerCaseInputValue);
    });

    setSuggestedUsers(newSuggestedUsers);

    setInputValue(newInputValue);
  };

  useEffect(() => {
    handleInputValueChange(inputValue);
  }, [users]);

  const comboboxRef = useRef<HTMLDivElement | null>(null);
  const isSubmitEnabled = isEmail(inputValue);

  const handleSubmit = () => {
    onSelect(inputValue);

    setInputValue("");
    closeMenu();
  };

  useShortcut("Enter", handleSubmit, { isEnabled: isSubmitEnabled });

  const { width: comboboxWidth } = useBoundingBox(comboboxRef);

  return (
    <UIHolder>
      <UIComboboxHolder>
        <UICombobox ref={comboboxRef}>
          <RoundedTextInput
            icon={<IconSearch />}
            onFocus={openMenu}
            placeholder="Search or enter email"
            value={inputValue}
            onChangeText={setInputValue}
          />
          <AnimatePresence>
            {isMenuOpen && (
              <Popover anchorRef={comboboxRef} placement="bottom-start">
                <UIDropdownHolder style={{ width: `${comboboxWidth}px` }}>
                  <ItemsDropdown
                    items={suggestedUsers}
                    keyGetter={(item) => item.id}
                    labelGetter={(item) => item.name || ""}
                    onItemSelected={({ email }) => {
                      if (!email) return;

                      setInputValue(email);
                    }}
                    selectedItems={users.filter(({ email }) => email === inputValue)}
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
