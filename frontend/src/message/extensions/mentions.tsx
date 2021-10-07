import { toPairs } from "lodash";
import { observer } from "mobx-react";
import React, { PropsWithChildren, useContext, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";

import { useDb } from "~frontend/clientdb";
import { MentionTaskDraftsContext } from "~frontend/message/content-and-task-drafts";
import { useAssertCurrentTeam } from "~frontend/team/useCurrentTeamId";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { UserBasicInfoFragment } from "~gql";
import { createAutocompletePlugin } from "~richEditor/autocomplete";
import { AutocompleteNodeProps, AutocompletePickerProps } from "~richEditor/autocomplete/component";
import { assert } from "~shared/assert";
import { useBoolean } from "~shared/hooks/useBoolean";
import { useSearch } from "~shared/search";
import { EditorMentionData } from "~shared/types/editor";
import { MentionType, REQUEST_READ, REQUEST_RESPONSE } from "~shared/types/mention";
import { PopPresenceAnimator } from "~ui/animations";
import { CircleIconButton } from "~ui/buttons/CircleIconButton";
import { EmptyStatePlaceholder } from "~ui/empty/EmptyStatePlaceholder";
import { ItemsDropdown } from "~ui/forms/OptionsDropdown/ItemsDropdown";
import { IconChevronUp, IconUser } from "~ui/icons";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { Popover } from "~ui/popovers/Popover";
import { SelectList } from "~ui/SelectList";
import { theme } from "~ui/theme";

const MentionPicker = observer(({ keyword, onSelect }: AutocompletePickerProps<EditorMentionData>) => {
  const { tasks, createOrUpdateTaskDraft } = useContext(MentionTaskDraftsContext);
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

  const task = tasks.find((task) => task.userId === selectedUserId);
  if (!teamMemberUsers.length || task) {
    return null;
  }

  // Picker has 2 stages. First we select user, then we select mention type.

  if (!selectedUserId) {
    return (
      <SelectList<UserBasicInfoFragment>
        items={matchingUsers}
        noItemsPlaceholder={<EmptyStatePlaceholder description="No users found" noSpacing icon={<IconUser />} />}
        keyGetter={(user) => user.id}
        onItemSelected={(user) => {
          setSelectedUserId(user.id);
          const task = tasks.find((task) => task.userId === user.id);
          if (task) {
            // if there is already a task for the user, reuse it
            onSelect({ taskId: task.id });
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
        if (createOrUpdateTaskDraft) {
          onSelect({ taskId: createOrUpdateTaskDraft(selectedUser.id, mentionType).id });
        }
      }}
    />
  );
});

type MentionTypeLabel = string;

const mentionTypeLabelMap: Record<MentionType, MentionTypeLabel> = {
  [REQUEST_READ]: "Request read receipt",
  [REQUEST_RESPONSE]: "Request response",
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

const TypedMention = observer((props: PropsWithChildren<AutocompleteNodeProps<EditorMentionData>>) => {
  const db = useDb();
  const anchorRef = useRef<HTMLAnchorElement | null>(null);

  const [isMentionPickerOpen, { set: openMentionTypePicker, unset: closeMentionTypePicker }] = useBoolean(false);
  const { tasks, createOrUpdateTaskDraft } = useContext(MentionTaskDraftsContext);

  useEffect(() => {
    if (!isMentionPickerOpen) return;

    props.editor.on("update", closeMentionTypePicker);

    return () => {
      props.editor.off("update", closeMentionTypePicker);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMentionPickerOpen]);

  useShortcut("Escape", closeMentionTypePicker);

  function handleOpenMentionTypePicker() {
    if (props.isEditable) {
      openMentionTypePicker();
    }
  }

  if (!props.data.taskId || tasks.length == 0) {
    return null;
  }

  const task = tasks.find((task) => task.id == props.data.taskId);
  const taskUser = task ? db.user.findById(task.userId) : null;

  if (!task || !taskUser) {
    return null;
  }

  return (
    <>
      {isMentionPickerOpen && (
        <Popover
          anchorRef={anchorRef}
          placement="top-start"
          onClickOutside={closeMentionTypePicker}
          isDisabled={!props.isEditable}
        >
          <PopPresenceAnimator>
            <MentionTypePicker
              selected={task.type}
              onSelect={(mentionType: MentionType) => {
                if (createOrUpdateTaskDraft) {
                  props.update({ taskId: createOrUpdateTaskDraft(task.userId, mentionType).id });
                }
                closeMentionTypePicker();
              }}
            />
          </PopPresenceAnimator>
        </Popover>
      )}
      <UIMention
        mentionType={task.type}
        ref={anchorRef}
        onClick={handleOpenMentionTypePicker}
        data-tooltip={mentionTypeLabelMap[task.type]}
      >
        @{taskUser.name}
        {props.isEditable && (
          <UIMentionPopoverOpenIndicator>
            <UIMentionIcon icon={<IconChevronUp />} size={"inherit"} />
          </UIMentionPopoverOpenIndicator>
        )}
      </UIMention>
    </>
  );
});

export const userMentionExtension = createAutocompletePlugin<EditorMentionData>({
  type: "mention",
  triggerChar: "@",
  nodeComponent(props) {
    return <TypedMention {...props} />;
  },
  pickerComponent: MentionPicker,
});

const UIMention = styled.span<{ mentionType: MentionType }>`
  cursor: default;
  height: 1.25em;
  padding: 2px 8px;

  ${theme.borderRadius.tag}
  ${theme.font.medium.inter.body12.build}

  ${(props) => {
    switch (props.mentionType) {
      case "request-read":
        return css`
          color: ${theme.colors.tags.shareInformation.foreground()};
          background-color: ${theme.colors.tags.shareInformation.background()};

          svg {
            color: ${theme.colors.tags.shareInformation.foreground()};
          }
        `;
      case "request-response":
        return css`
          color: ${theme.colors.tags.discussion.foreground()};
          background-color: ${theme.colors.tags.discussion.background()};

          svg {
            color: ${theme.colors.tags.discussion.foreground()};
          }
        `;
      default:
        return "";
    }
  }};
`;

const UISelectItem = styled.div<{}>`
  display: flex;
  align-items: center;
  ${UserAvatar} {
    font-size: 1.5rem;
    margin-right: 8px;
  }
`;

const UIMentionIcon = styled(CircleIconButton)`
  display: inline;
`;

const UIMentionPopoverOpenIndicator = styled.span<{}>`
  display: inline;

  padding-left: 4px;
  margin-left: 4px;

  border-left: 1px solid ${theme.colors.layout.strongLine((modifiers) => [modifiers.opacity(0.3)])};
`;
