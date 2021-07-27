import React, { useEffect, useRef, useState } from "react";
import { useClickAway } from "react-use";
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
import { useBoolean } from "~shared/hooks/useBoolean";
import { useSearch } from "~shared/search";
import isEmail from "validator/lib/isEmail";

interface Props {
  users: UserBasicInfoFragment[];
  onAddMember: (userId: string) => void;
  onInviteByEmail?: (email: string) => void;
}

export const AddMemberInlineForm = ({ users, onAddMember, onInviteByEmail }: Props) => {
  const [isMenuOpen, { set: openMenu, unset: closeMenu }] = useBoolean(false);

  const [inputValue, setInputValue] = useState("");

  const getSuggestedUsers = useSearch(users, (user) => [user.email, user.name]);
  const suggestedUsers = getSuggestedUsers(inputValue);

  const comboboxRef = useRef<HTMLDivElement | null>(null);

  const selectedUser = users.find(({ email }) => inputValue === email);
  const isSubmitEnabled = Boolean(selectedUser) || (onInviteByEmail && isEmail(inputValue));

  useEffect(() => {
    if (selectedUser) {
      closeMenu();
    } else if (inputValue) {
      openMenu();
    }
  }, [selectedUser, inputValue]);

  const handleSubmit = () => {
    setInputValue("");

    if (selectedUser) {
      onAddMember(selectedUser.id);
    } else if (onInviteByEmail) {
      onInviteByEmail(inputValue);
    }
  };

  useShortcut(
    "Enter",
    () => {
      handleSubmit();

      return true;
    },
    { isEnabled: isSubmitEnabled }
  );

  useClickAway(comboboxRef, closeMenu);

  const { width: comboboxWidth } = useBoundingBox(comboboxRef);

  return (
    <UIHolder>
      <UICombobox ref={comboboxRef}>
        <RoundedTextInput
          icon={<IconSearch />}
          onFocus={openMenu}
          placeholder="Search with name or email"
          value={inputValue}
          onChangeText={setInputValue}
        />
        <AnimatePresence>
          {isMenuOpen && suggestedUsers.length > 0 && (
            <Popover distance={-2} anchorRef={comboboxRef} placement="bottom-start">
              <UIDropdownHolder width={comboboxWidth}>
                <ItemsDropdown
                  items={suggestedUsers}
                  keyGetter={(item) => item.id}
                  labelGetter={(item) => item.name || ""}
                  onItemSelected={({ email }) => {
                    if (!email) return;

                    setInputValue(email);
                  }}
                  selectedItems={users.filter(({ email }) => email === inputValue)}
                  iconGetter={(item) => <Avatar size="small" url={item.avatar_url} />}
                />
              </UIDropdownHolder>
            </Popover>
          )}
        </AnimatePresence>
      </UICombobox>
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

const UIDropdownHolder = styled.div<{ width: number }>`
  width: ${({ width }) => width}px;
`;

const UICombobox = styled.div`
  position: relative;
`;
