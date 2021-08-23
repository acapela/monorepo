import { gql, useQuery } from "@apollo/client";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useClickAway } from "react-use";
import styled from "styled-components";
import isEmail from "validator/lib/isEmail";

import { useAssertCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import { Avatar } from "~frontend/ui/users/Avatar";
import { MissingTeamMembersQuery, MissingTeamMembersQueryVariables } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { useBoundingBox } from "~shared/hooks/useBoundingBox";
import { useSearch } from "~shared/search";
import { Button } from "~ui/buttons/Button";
import { ItemsDropdown } from "~ui/forms/OptionsDropdown/ItemsDropdown";
import { RoundedTextInput } from "~ui/forms/RoundedTextInput";
import { IconPlusSquare, IconSearch } from "~ui/icons";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { Popover } from "~ui/popovers/Popover";

interface Props {
  memberUserIds: string[];
  onAddMember: (userId: string) => void;
  onInviteByEmail?: (email: string) => void;
}

export const AddMemberInlineForm = ({ memberUserIds, onAddMember, onInviteByEmail }: Props) => {
  const canInviteByEmail = Boolean(onInviteByEmail);
  const teamId = useAssertCurrentTeamId();
  const { data } = useQuery<MissingTeamMembersQuery, MissingTeamMembersQueryVariables>(
    gql`
      query MissingTeamMembers($teamId: uuid!, $userIds: [uuid!]) {
        missingTeamMembers: team_member(where: { team_id: { _eq: $teamId }, user_id: { _nin: $userIds } }) {
          user {
            id
            name
            email
            avatar_url
          }
        }
      }
    `,
    { variables: { teamId, userIds: memberUserIds } }
  );
  const users = (data?.missingTeamMembers ?? []).map((t) => t.user);

  const [isMenuOpen, { set: openMenu, unset: closeMenu }] = useBoolean(false);

  const [inputValue, setInputValue] = useState("");

  const getSuggestedUsers = useSearch(users, (user) => [user.email, user.name]);
  const suggestedUsers = getSuggestedUsers(inputValue);

  const comboboxRef = useRef<HTMLDivElement | null>(null);

  const selectedUser = users.find(({ email }) => inputValue === email);
  const isSubmitEnabled = Boolean(selectedUser) || (canInviteByEmail && isEmail(inputValue));

  useEffect(() => {
    if (selectedUser) {
      closeMenu();
    } else if (inputValue) {
      openMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          placeholder={canInviteByEmail ? "Search or enter email" : "Search with name or email"}
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

const UIHolder = styled.div<{}>`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
`;

const UIDropdownHolder = styled.div<{ width: number }>`
  width: ${({ width }) => width}px;
`;

const UICombobox = styled.div<{}>`
  position: relative;
`;
