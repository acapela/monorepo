import { observer } from "mobx-react";
import React, { useRef, useState } from "react";
import styled, { css } from "styled-components";

import { UserEntity } from "@aca/frontend/clientdb/user";
import { useAssertCurrentTeam } from "@aca/frontend/team/CurrentTeam";
import { UserAvatar } from "@aca/frontend/ui/users/UserAvatar";
import { useBoolean } from "@aca/shared/hooks/useBoolean";
import { isNotNullish } from "@aca/shared/nullish";
import { useSearch } from "@aca/shared/search";
import { PopPresenceAnimator } from "@aca/ui/animations";
import { EmptyStatePlaceholder } from "@aca/ui/empty/EmptyStatePlaceholder";
import { IconUser } from "@aca/ui/icons";
import { Popover } from "@aca/ui/popovers/Popover";
import { SelectList } from "@aca/ui/SelectList";
import { theme } from "@aca/ui/theme";

type UserPickerProps = { alreadyPickedIds: Set<String>; onPick: (user: UserEntity) => void };
export const UserPicker = observer(({ alreadyPickedIds, onPick }: UserPickerProps) => {
  const team = useAssertCurrentTeam();
  const [keyword, setKeyword] = useState("");
  const [isOpen, { set: show, unset: hide }] = useBoolean(false);

  const anchorRef = useRef(null);

  const users = team.memberships
    .query((member) => !alreadyPickedIds.has(member.user_id))
    .all.map((member) => member.user)
    .filter(isNotNullish);
  const foundUsers = useSearch(users, (user) => [user.name])(keyword);

  return (
    <UIMention>
      <UIAt $isPlaceholder={!keyword}>@</UIAt>
      <UIMentionInput
        ref={anchorRef}
        type="text"
        placeholder="User Name"
        value={keyword}
        onFocus={show}
        onBlur={() => {
          setKeyword("");
        }}
        onChange={(event) => {
          setKeyword(event.target.value.trim());
        }}
      />
      {isOpen && (
        <Popover anchorRef={anchorRef} placement="top-start" onClickOutside={hide} enableScreenCover>
          <PopPresenceAnimator>
            <SelectList<UserEntity>
              items={foundUsers}
              noItemsPlaceholder={<EmptyStatePlaceholder description="No users found" noSpacing icon={<IconUser />} />}
              keyGetter={(user) => user.id}
              onItemSelected={(item) => {
                onPick(item);
                setKeyword("");
              }}
              renderItem={(user) => (
                <UISelectItem>
                  <UserAvatar user={user} size="inherit" /> {user.name}
                </UISelectItem>
              )}
            />
          </PopPresenceAnimator>
        </Popover>
      )}
    </UIMention>
  );
});

const UISelectItem = styled.div<{}>`
  display: flex;
  align-items: center;
  ${theme.spacing.actions.asGap};

  ${UserAvatar} {
    font-size: 1.5rem;
  }
`;

export const UIMention = styled.div<{}>`
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  ${theme.font.medium.resetLineHeight};
`;

export const UIAt = styled.div<{ $isPlaceholder: boolean }>`
  display: flex;
  align-items: center;
  ${(props) =>
    props.$isPlaceholder &&
    css`
      color: rgb(117, 117, 117);
    `}
`;

export const UIMentionInput = styled.input`
  padding: 0;
  height: fit-content;
  ${theme.font.medium.resetLineHeight};

  &:focus {
    outline: none;
  }
`;
