import { AnimatePresence } from "framer-motion";
import { isEqual } from "lodash";
import { observer } from "mobx-react";
import React, { useMemo, useRef, useState } from "react";
import { useList } from "react-use";
import styled, { css } from "styled-components";

import { useDb } from "~frontend/clientdb";
import { TeamEntity } from "~frontend/clientdb/team";
import { UserEntity } from "~frontend/clientdb/user";
import { UserGroupEntity } from "~frontend/clientdb/userGroup";
import { useAssertCurrentTeam } from "~frontend/team/CurrentTeam";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import { useBoolean } from "~shared/hooks/useBoolean";
import { isNotNullish } from "~shared/nullish";
import { useSearch } from "~shared/search";
import { PopPresenceAnimator } from "~ui/animations";
import { TextButton } from "~ui/buttons/TextButton";
import { EmptyStatePlaceholder } from "~ui/empty/EmptyStatePlaceholder";
import { IconUser } from "~ui/icons";
import { Popover } from "~ui/popovers/Popover";
import { SelectList } from "~ui/SelectList";
import { theme } from "~ui/theme";

type UserPickerProps = { alreadyPickedIds: Set<String>; onPick: (user: UserEntity) => void };
const UserPicker = observer(({ alreadyPickedIds, onPick }: UserPickerProps) => {
  const team = useAssertCurrentTeam();
  const [keyword, setKeyword] = useState("");
  const [isOpen, { set: show, unset: hide }] = useBoolean(false);

  const anchorRef = useRef(null);

  const users = team.members
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
          hide();
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

const UserGroupForm = observer(({ group }: { group?: UserGroupEntity }) => {
  const db = useDb();

  const initialName = group?.name ?? "";
  const initialUsers = group?.members.all.map((member) => member.user).filter(isNotNullish) ?? [];
  const [name, setName] = useState(initialName);
  const [users, usersList] = useList(initialUsers);

  const userIds = useMemo(() => new Set(users.map((u) => u.id)), [users]);

  const hasChanges =
    name.trim() !== initialName || !isEqual(Array.from(userIds).sort(), initialUsers.map((u) => u.id).sort());
  const isNameEmpty = name.trim().length == 0;
  const isNameDuplicate = db.userGroup.query((g) => g.id !== group?.id && g.name == name).hasItems;

  const resetForm = () => {
    setName(initialName);
    usersList.set(initialUsers);
  };

  return (
    <UIForm
      onSubmit={(event) => {
        event.preventDefault();
        let userGroup = group;
        if (userGroup) {
          userGroup.update({ name });
        } else {
          userGroup = db.userGroup.create({ name: name });
        }
        const removedMembers = userGroup.members.all.filter((member) => !userIds.has(member.user_id));
        for (const member of removedMembers) {
          member.remove();
        }
        const newMemberUserIds = Array.from(userIds).filter(
          (id) => !userGroup || !userGroup.members.all.some((member) => member.user_id == id)
        );
        for (const userId of newMemberUserIds) {
          db.userGroupMember.create({ user_group_id: userGroup.id, user_id: userId });
        }
        if (!group) {
          resetForm();
        }
      }}
    >
      <UIMention>
        <UIAt $isPlaceholder={!name}>@</UIAt>
        <UIMentionInput
          type="text"
          placeholder="New Group Name"
          value={name}
          onChange={(event) => setName(event.target.value.trimLeft())}
        />
      </UIMention>
      <UIDivider />
      <UIMentions>
        {users.map((user, i) => (
          <UIMentionButton key={user.id} data-tooltip="Click to remove" onClick={() => usersList.removeAt(i)}>
            @{user.name}
          </UIMentionButton>
        ))}
        <UserPicker alreadyPickedIds={userIds} onPick={(user) => usersList.push(user)} />
        <UIButtons>
          <AnimatePresence>
            {group && (
              <PopPresenceAnimator>
                <TextButton
                  type="button"
                  kind="secondary"
                  inline
                  onClick={async () => {
                    if (
                      await openConfirmPrompt({ title: `Are you sure you want to delete the ${group.name} group?` })
                    ) {
                      group.remove();
                    }
                  }}
                >
                  Delete Group
                </TextButton>
              </PopPresenceAnimator>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {group && hasChanges && (
              <PopPresenceAnimator>
                <TextButton type="button" kind="secondary" inline onClick={resetForm}>
                  Undo Changes
                </TextButton>
              </PopPresenceAnimator>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {(!group || hasChanges) && (
              <PopPresenceAnimator>
                <TextButton
                  type="submit"
                  kind="primary"
                  inline
                  data-tooltip={
                    isNameEmpty || isNameDuplicate
                      ? `Enter a ${isNameDuplicate ? "unique " : ""}group name to save it`
                      : undefined
                  }
                  isDisabled={isNameEmpty || isNameDuplicate}
                >
                  {group ? "Save Group" : "Add Group"}
                </TextButton>
              </PopPresenceAnimator>
            )}
          </AnimatePresence>
        </UIButtons>
      </UIMentions>
    </UIForm>
  );
});

export const UserGroupsSettings = observer(({ team }: { team: TeamEntity }) => (
  <UIPanel>
    <UITitle>Groups</UITitle>
    <UIGroupRows>
      <AnimatePresence>
        {team.userGroups.all.map((group) => (
          <PopPresenceAnimator key={group.id}>
            <UserGroupForm group={group} />
          </PopPresenceAnimator>
        ))}
        <PopPresenceAnimator>
          <UserGroupForm />
        </PopPresenceAnimator>
      </AnimatePresence>
    </UIGroupRows>
  </UIPanel>
));

const UIPanel = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 24px;

  ${theme.colors.layout.background.withBorder.asBg};
  ${theme.radius.primaryItem};

  width: 100%;
`;

const UITitle = styled.h3<{}>`
  ${theme.typo.secondaryTitle};
`;

const UIGroupRows = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const UIForm = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  @media (max-width: 600px) {
    flex-wrap: wrap;
  }
`;

const UIMention = styled.div<{}>`
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  ${theme.font.medium.resetLineHeight};
`;

const UIAt = styled.div<{ $isPlaceholder: boolean }>`
  display: flex;
  align-items: center;
  ${(props) =>
    props.$isPlaceholder &&
    css`
      color: rgb(117, 117, 117);
    `}
`;

const UIMentionInput = styled.input`
  padding: 0;
  height: fit-content;
  ${theme.font.medium.resetLineHeight};

  &:focus {
    outline: none;
  }
`;

const UIDivider = styled.div<{}>`
  width: 1px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.05);
`;

const UIMentions = styled.div<{}>`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

const UIMentionButton = styled.button`
  padding: 0;
  background: none;
  cursor: pointer;
  ${theme.font.medium};
`;

const UISelectItem = styled.div<{}>`
  display: flex;
  align-items: center;
  ${theme.spacing.actions.asGap};

  ${UserAvatar} {
    font-size: 1.5rem;
  }
`;

const UIButtons = styled.div<{}>`
  margin-left: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;
