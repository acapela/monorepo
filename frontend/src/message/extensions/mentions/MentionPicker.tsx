import { JSONContent } from "@tiptap/react";
import { observer } from "mobx-react";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { useDb } from "@aca/frontend/clientdb";
import { UserEntity } from "@aca/frontend/clientdb/user";
import { UserGroupEntity } from "@aca/frontend/clientdb/userGroup";
import { useAssertCurrentTeam } from "@aca/frontend/team/CurrentTeam";
import { Avatar } from "@aca/frontend/ui/users/Avatar";
import { UserAvatar } from "@aca/frontend/ui/users/UserAvatar";
import { AutocompletePickerProps } from "@aca/richEditor/autocomplete/component";
import { getMentionNodesFromContent } from "@aca/shared/editor/mentions";
import { isNotNullish } from "@aca/shared/nullish";
import { MentionType } from "@aca/shared/requests";
import { useSearch } from "@aca/shared/search";
import { EditorMentionData } from "@aca/shared/types/editor";
import { EmptyStatePlaceholder } from "@aca/ui/empty/EmptyStatePlaceholder";
import { IconUser } from "@aca/ui/icons";
import { SelectList } from "@aca/ui/SelectList";
import { theme } from "@aca/ui/theme";

import { MentionTypePicker } from "./MentionTypePicker";

type SearchableItem = { terms: string[] } & (
  | { type: "user"; entity: UserEntity }
  | { type: "user_group"; entity: UserGroupEntity }
);

const convertSearchableItemToMentionData = (item: SearchableItem, type: MentionType): EditorMentionData[] =>
  item.type == "user"
    ? [{ userId: item.entity.id, type }]
    : item.entity.members.all.map((member) => ({ type, userId: member.user_id }));

export const MentionPicker = observer(({ keyword, onSelect, editor }: AutocompletePickerProps<EditorMentionData>) => {
  const db = useDb();
  const team = useAssertCurrentTeam();
  const teamMemberUsers = team.memberships.all.map((member) => member.user).filter(isNotNullish);
  const userGroups = db.userGroup.query({ team_id: team.id }).all;

  const [selectedItem, setSelectedItem] = useState<SearchableItem | null>(null);

  const searchableItems = useMemo<SearchableItem[]>(
    () => [
      ...teamMemberUsers.map((user) => ({ type: "user" as const, entity: user, terms: [user.email, user.name] })),
      ...userGroups.map((group) => ({ type: "user_group" as const, entity: group, terms: [group.name] })),
    ],
    [teamMemberUsers, userGroups]
  );
  const matchingItems = useSearch(searchableItems, (item) => item.terms)(keyword);

  useEffect(() => {
    // In case user is selected, but then we continue typing (aka searching for different user)
    // return selected user choice
    setSelectedItem(null);
  }, [keyword]);

  if (!teamMemberUsers.length) return null;

  // Picker has 2 stages. First we select user/group, then we select mention type.

  if (!selectedItem) {
    return (
      <SelectList<SearchableItem>
        items={matchingItems}
        noItemsPlaceholder={
          <EmptyStatePlaceholder description="No users nor groups found" noSpacing icon={<IconUser />} />
        }
        keyGetter={({ entity }) => entity.id}
        onItemSelected={(item) => {
          const userIds = new Set(
            item.type == "user" ? [item.entity.id] : item.entity.members.all.map((member) => member.user_id)
          );
          // when there is already a mention node for the given user (or one of the users in the group), use that
          // type for the new mention node
          const mentionNodeForSameUser = getMentionNodesFromContent(editor.getJSON() as JSONContent).find(
            ({ attrs: { data } }) => userIds.has(data.userId)
          );
          if (mentionNodeForSameUser) {
            onSelect(convertSearchableItemToMentionData(item, mentionNodeForSameUser.attrs.data.type));
          } else {
            setSelectedItem(item);
          }
        }}
        renderItem={(item) => (
          <UISelectItem>
            {item.type == "user" && (
              <>
                <UserAvatar user={item.entity} size="inherit" /> {item.entity.name}
              </>
            )}
            {item.type == "user_group" && (
              <>
                <Avatar name={item.entity.name} size={24} /> {item.entity.name}{" "}
                <UIGroupIndicator>(group)</UIGroupIndicator>
              </>
            )}
          </UISelectItem>
        )}
      />
    );
  }

  return (
    <MentionTypePicker
      onSelect={(type) => {
        onSelect(convertSearchableItemToMentionData(selectedItem, type));
      }}
    />
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

const UIGroupIndicator = styled.div<{}>`
  ${theme.colors.text.readableText.tertiary.asColor}
`;
