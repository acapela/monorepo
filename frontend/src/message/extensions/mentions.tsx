import { JSONContent } from "@tiptap/core";
import { toPairs } from "lodash";
import { observer } from "mobx-react";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { useDb } from "~frontend/clientdb";
import { UserEntity } from "~frontend/clientdb/user";
import { useAssertCurrentTeam } from "~frontend/team/useCurrentTeamId";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { createAutocompletePlugin } from "~richEditor/autocomplete";
import { AutocompleteNodeProps, AutocompletePickerProps } from "~richEditor/autocomplete/component";
import { assert } from "~shared/assert";
import { MENTION_TYPE_KEY, getMentionNodesFromContent } from "~shared/editor/mentions";
import { useBoolean } from "~shared/hooks/useBoolean";
import { useSearch } from "~shared/search";
import { EditorMentionData } from "~shared/types/editor";
import { MentionType } from "~shared/types/mention";
import { PopPresenceAnimator } from "~ui/animations";
import { IconButton } from "~ui/buttons/IconButton";
import { EmptyStatePlaceholder } from "~ui/empty/EmptyStatePlaceholder";
import { ItemsDropdown } from "~ui/forms/OptionsDropdown/ItemsDropdown";
import { IconChevronUp, IconUser } from "~ui/icons";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { Popover } from "~ui/popovers/Popover";
import { SelectList } from "~ui/SelectList";
import { theme } from "~ui/theme";

const MentionPicker = observer(({ keyword, onSelect, editor }: AutocompletePickerProps<EditorMentionData>) => {
  const team = useAssertCurrentTeam();
  const teamMemberUsers = team.members.all.map((member) => member.user);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const getMatchingUsers = useSearch(teamMemberUsers, (user) => [user.email, user.name]);

  const matchingUsers = getMatchingUsers(keyword);

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

  const selectedUser = teamMemberUsers.find((teamMember) => teamMember.id === selectedUserId);

  assert(selectedUser, "Incorrect user selected");

  return (
    <MentionTypePicker
      selected="request-read"
      onSelect={(mentionType) => {
        onSelect({ userId: selectedUser.id, type: mentionType });
      }}
    />
  );
});

type MentionTypeLabel = string;

const mentionTypeLabelMap: Record<MentionType, MentionTypeLabel> = {
  "request-read": "Request read receipt",
  "request-response": "Request response",
};

function MentionTypePicker({
  selected,
  onSelect,
}: {
  selected: MentionType;
  onSelect: (mention: MentionType) => void;
}) {
  type MentionLabelPair = [MentionType, MentionTypeLabel];

  const mentionLabelPairs = toPairs(mentionTypeLabelMap) as Array<MentionLabelPair>;
  const selectedPair = [selected, mentionTypeLabelMap[selected]] as MentionLabelPair;

  return (
    <ItemsDropdown
      items={mentionLabelPairs}
      keyGetter={([mentionType]) => mentionType}
      onItemSelected={([mentionType]) => onSelect(mentionType)}
      labelGetter={([, mentionLabel]) => mentionLabel}
      selectedItems={[selectedPair]}
    />
  );
}

function updateContentMentionTypesForUser(node: JSONContent, userId: string, type: MentionType): JSONContent {
  let attrs = node.attrs;
  if (node.type === MENTION_TYPE_KEY) {
    const { data } = node.attrs as { data: EditorMentionData };
    if (data.userId == userId) {
      attrs = { data: { userId, type } };
    }
  }

  const content = node.content
    ? node.content.map((childNode) => updateContentMentionTypesForUser(childNode, userId, type))
    : undefined;

  return { ...node, attrs, content };
}

const TypedMention = observer((props: PropsWithChildren<AutocompleteNodeProps<EditorMentionData>>) => {
  const { editor, isEditable, data } = props;
  const db = useDb();
  const anchorRef = useRef<HTMLAnchorElement | null>(null);

  const [isMentionPickerOpen, { set: openMentionTypePicker, unset: closeMentionTypePicker }] = useBoolean(false);
  useEffect(() => {
    if (!isMentionPickerOpen) return;

    editor.on("update", closeMentionTypePicker);

    return () => {
      editor.off("update", closeMentionTypePicker);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMentionPickerOpen]);

  useShortcut("Escape", closeMentionTypePicker);

  function handleOpenMentionTypePicker() {
    if (isEditable) {
      openMentionTypePicker();
    }
  }

  return (
    <>
      {isMentionPickerOpen && (
        <Popover
          anchorRef={anchorRef}
          placement="top-start"
          onClickOutside={closeMentionTypePicker}
          isDisabled={!isEditable}
        >
          <PopPresenceAnimator>
            <MentionTypePicker
              selected={data.type}
              onSelect={(mentionType: MentionType) => {
                editor.commands.setContent(
                  updateContentMentionTypesForUser(editor.getJSON() as never, data.userId, mentionType)
                );
                closeMentionTypePicker();
              }}
            />
          </PopPresenceAnimator>
        </Popover>
      )}
      <UIMention
        mentionType={data.type}
        ref={anchorRef}
        onClick={handleOpenMentionTypePicker}
        data-tooltip={mentionTypeLabelMap[data.type]}
      >
        @{db.user.findById(data.userId)?.name ?? "???"}
        {isEditable && (
          <UIMentionPopoverOpenIndicator>
            <UIMentionIcon icon={<IconChevronUp />} />
          </UIMentionPopoverOpenIndicator>
        )}
      </UIMention>
    </>
  );
});

export const userMentionExtension = createAutocompletePlugin<EditorMentionData>({
  type: "mention",
  triggerChar: "@",
  nodeComponent: TypedMention,
  pickerComponent: MentionPicker,
});

const UIMention = styled.span<{ mentionType: MentionType }>`
  cursor: default;

  ${theme.colors.tags.primary.asColor};

  svg {
    color: inherit;
  }
`;

const UISelectItem = styled.div<{}>`
  display: flex;
  align-items: center;
  ${UserAvatar} {
    font-size: 1.5rem;
    margin-right: 8px;
  }
`;

const UIMentionIcon = styled(IconButton)`
  display: inline;
`;

const UIMentionPopoverOpenIndicator = styled.span<{}>`
  display: inline;

  padding-left: 4px;
  margin-left: 4px;

  border-left: 1px solid ${theme.colors.layout.background.border};
`;
