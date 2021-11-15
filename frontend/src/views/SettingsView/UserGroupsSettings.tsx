import { AnimatePresence } from "framer-motion";
import { isEqual } from "lodash";
import { observer } from "mobx-react";
import React, { useMemo, useState } from "react";
import { useList } from "react-use";
import styled from "styled-components";

import { useDb } from "~frontend/clientdb";
import { TeamEntity } from "~frontend/clientdb/team";
import { UserGroupEntity } from "~frontend/clientdb/userGroup";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import { isNotNullish } from "~shared/nullish";
import { PopPresenceAnimator } from "~ui/animations";
import { TextButton } from "~ui/buttons/TextButton";
import { theme } from "~ui/theme";

import { UIAt, UIMention, UIMentionInput, UserPicker } from "./UserPicker";

function useUpdateUserGroupMembers() {
  const db = useDb();
  return function updateUserGroupMembers(group: UserGroupEntity, userIds: Set<string>) {
    const removedMembers = group.members.all.filter((member) => !userIds.has(member.user_id));
    for (const member of removedMembers) {
      member.remove();
    }
    const newMemberUserIds = Array.from(userIds).filter(
      (id) => !group || !group.members.all.some((member) => member.user_id == id)
    );
    for (const userId of newMemberUserIds) {
      db.userGroupMember.create({ user_group_id: group.id, user_id: userId });
    }
  };
}

const UserGroupForm = observer(({ group }: { group?: UserGroupEntity }) => {
  const db = useDb();
  const updateUserGroupMembers = useUpdateUserGroupMembers();

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
        if (group) {
          group.update({ name });
          updateUserGroupMembers(group, userIds);
        } else {
          const group = db.userGroup.create({ name: name });
          updateUserGroupMembers(group, userIds);
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

const UIButtons = styled.div<{}>`
  margin-left: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;
