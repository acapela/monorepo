import { toPairs } from "lodash";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";

import { useCurrentTeamMembers } from "~frontend/gql/teams";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { UserBasicInfoFragment } from "~gql";
import { createAutocompletePlugin } from "~richEditor/autocomplete";
import { AutocompleteNodeProps, AutocompletePickerProps } from "~richEditor/autocomplete/component";
import { assert } from "~shared/assert";
import { useBoolean } from "~shared/hooks/useBoolean";
import { useSearch } from "~shared/search";
import { EditorMentionData } from "~shared/types/editor";
import { DEFAULT_MENTION_TYPE, MentionType } from "~shared/types/mention";
import { PopPresenceAnimator } from "~ui/animations";
import { CircleIconButton } from "~ui/buttons/CircleIconButton";
import { EmptyStatePlaceholder } from "~ui/empty/EmptyStatePlaceholder";
import { ItemsDropdown } from "~ui/forms/OptionsDropdown/ItemsDropdown";
import { IconChevronUp, IconUser } from "~ui/icons";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { Popover } from "~ui/popovers/Popover";
import { SelectList } from "~ui/SelectList";
import { theme } from "~ui/theme";

/**
 * TODO: This type should be moved to `shared/types` when we'll add backend integration that will pick message mentions
 * to create notifications.
 */

function MentionPicker({ keyword, onSelect }: AutocompletePickerProps<EditorMentionData>) {
  // TODO: Discussion -> Show only room members when inside a private room
  const teamMembers = useCurrentTeamMembers();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const getMatchingUsers = useSearch(teamMembers, (user) => [user.email, user.name]);

  const matchingUsers = getMatchingUsers(keyword);

  useEffect(() => {
    // In case user is selected, but then we continue typing (aka searching for different user)
    // return selected user choice
    setSelectedUserId(null);
  }, [keyword]);

  if (!teamMembers.length) return null;

  // Picker has 2 stages. First we select user, then we select mention type.

  if (!selectedUserId) {
    return (
      <SelectList<UserBasicInfoFragment>
        items={matchingUsers}
        noItemsPlaceholder={<EmptyStatePlaceholder description="No users found" noSpacing icon={<IconUser />} />}
        keyGetter={(user) => user.id}
        onItemSelected={(user) => {
          setSelectedUserId(user.id);
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

  const selectedUser = teamMembers.find((teamMember) => teamMember.id === selectedUserId);

  assert(selectedUser, "Incorrect user selected");

  return (
    <MentionTypePicker
      selected="request-read"
      onSelect={(mentionType) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        onSelect({ originalName: selectedUser.name!, userId: selectedUser.id, type: mentionType });
      }}
    />
  );
}

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

function TypedMention(props: PropsWithChildren<AutocompleteNodeProps<EditorMentionData>>) {
  const anchorRef = useRef<HTMLAnchorElement | null>(null);

  const [isMentionPickerOpen, { set: openMentionTypePicker, unset: closeMentionTypePicker }] = useBoolean(false);
  const [mentionType, setMentionType] = useState<MentionType>(props.data.type ?? DEFAULT_MENTION_TYPE);

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

  const otherProps = !props.isEditable ? { "data-tooltip": props.data.originalName } : {};

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
              selected={mentionType}
              onSelect={(mentionType: MentionType) => {
                setMentionType(mentionType);
                props.update({ type: mentionType });
                closeMentionTypePicker();
              }}
            />
          </PopPresenceAnimator>
        </Popover>
      )}
      <UIMention mentionType={mentionType} ref={anchorRef} onClick={handleOpenMentionTypePicker} {...otherProps}>
        @{props?.data?.originalName}
        {props.isEditable && (
          <UIMentionPopoverOpenIndicator>
            <UIMentionIcon icon={<IconChevronUp />} size={"inherit"} />
          </UIMentionPopoverOpenIndicator>
        )}
      </UIMention>
    </>
  );
}

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
