import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { UserEntity } from "~frontend/clientdb/user";
import { useAssertCurrentTeam } from "~frontend/team/CurrentTeam";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { AutocompletePickerProps } from "~richEditor/autocomplete/component";
import { assert } from "~shared/assert";
import { getMentionNodesFromContent } from "~shared/editor/mentions";
import { isNotNullish } from "~shared/nullish";
import { useSearch } from "~shared/search";
import { EditorMentionData } from "~shared/types/editor";
import { EmptyStatePlaceholder } from "~ui/empty/EmptyStatePlaceholder";
import { IconUser } from "~ui/icons";
import { SelectList } from "~ui/SelectList";
import { theme } from "~ui/theme";

import { MentionTypePicker } from "./MentionTypePicker";

export const MentionPicker = observer(({ keyword, onSelect, editor }: AutocompletePickerProps<EditorMentionData>) => {
  const team = useAssertCurrentTeam();
  const teamMemberUsers = team.members.all.map((member) => member.user).filter(isNotNullish);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const matchingUsers = useSearch(teamMemberUsers, (user) => [user.email, user.name])(keyword);

  useEffect(() => {
    // In case user is selected, but then we continue typing (aka searching for different user)
    // return selected user choice
    setSelectedUserId(null);
  }, [keyword]);

  if (!teamMemberUsers.length) return null;

  // Picker has 2 stages. First we select user, then we select mention type.

  if (!selectedUserId) {
    return (
      <SelectList<UserEntity>
        items={matchingUsers}
        noItemsPlaceholder={<EmptyStatePlaceholder description="No users found" noSpacing icon={<IconUser />} />}
        keyGetter={(user) => user.id}
        onItemSelected={(user) => {
          const mentionNodeForSameUser = getMentionNodesFromContent(editor.getJSON() as never).find(
            (node) => node.attrs.data.userId === user.id
          );
          if (mentionNodeForSameUser) {
            onSelect({ userId: user.id, type: mentionNodeForSameUser.attrs.data.type });
          } else {
            setSelectedUserId(user.id);
          }
        }}
        renderItem={(user) => {
          return (
            <UISelectItem>
              <UserAvatar user={user} size="inherit" /> {user.name}
            </UISelectItem>
          );
        }}
      />
    );
  }

  const selectedUser = teamMemberUsers.find((teamMember) => teamMember && teamMember.id === selectedUserId);

  assert(selectedUser, "Incorrect user selected");

  return (
    <MentionTypePicker
      onSelect={(mentionType) => {
        onSelect({ userId: selectedUser.id, type: mentionType });
      }}
    />
  );
});

const UISelectItem = styled.div<{}>`
  display: flex;
  align-items: center;
  ${theme.spacing.horizontalActions.asGap};

  ${UserAvatar} {
    font-size: 1.5rem;
  }
`;
