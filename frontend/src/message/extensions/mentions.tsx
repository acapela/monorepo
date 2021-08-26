import { toPairs } from "lodash";
import React, { PropsWithChildren, useRef, useState } from "react";
import styled, { css } from "styled-components";

import { useCurrentTeamMembers } from "~frontend/gql/teams";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { UserBasicInfoFragment } from "~gql";
import { createAutocompletePlugin } from "~richEditor/autocomplete";
import { AutocompleteNodeProps, AutocompletePickerProps } from "~richEditor/autocomplete/component";
import { useBoolean } from "~shared/hooks/useBoolean";
import { useSearch } from "~shared/search";
import { EditorMentionData } from "~shared/types/editor";
import { DEFAULT_MENTION_TYPE, MentionType } from "~shared/types/mention";
import { PopPresenceAnimator } from "~ui/animations";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { Popover } from "~ui/popovers/Popover";
import { SelectList } from "~ui/SelectList";
import { theme } from "~ui/theme";

/**
 * TODO: This type should be moved to `shared/types` when we'll add backend integration that will pick message mentions
 * to create notifications.
 */

function UserPicker({ keyword, onSelect }: AutocompletePickerProps<EditorMentionData>) {
  const teamMembers = useCurrentTeamMembers();

  const getMatchingUsers = useSearch(teamMembers, (user) => [user.email, user.name]);

  const matchingUsers = getMatchingUsers(keyword);

  return (
    <SelectList<UserBasicInfoFragment>
      items={matchingUsers}
      keyGetter={(user) => user.id}
      onItemSelected={(user) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        onSelect({ originalName: user.name!, userId: user.id, type: DEFAULT_MENTION_TYPE });
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

type MentionTypeLabel = string;
const mentionTypeLabelMap: Record<MentionType, MentionTypeLabel> = {
  "notification-only": "Notify only",
  "request-read": "Request read receipt",
  "request-response": "Request response",
};

function MentionTypePicker({ onSelect }: { onSelect: (mention: MentionType) => void }) {
  const mentionLabelPairs = toPairs(mentionTypeLabelMap) as Array<[MentionType, MentionTypeLabel]>;

  return (
    <SelectList<[MentionType, MentionTypeLabel]>
      items={mentionLabelPairs}
      keyGetter={([mentionType]) => mentionType}
      onItemSelected={([mentionType]) => onSelect(mentionType)}
      renderItem={([, mentionLabel]) => {
        return <UISelectItem>{mentionLabel}</UISelectItem>;
      }}
    />
  );
}

function TypedMention(props: PropsWithChildren<AutocompleteNodeProps<EditorMentionData>>) {
  const anchorRef = useRef<HTMLAnchorElement | null>(null);

  const [isMentionPickerOpen, { toggle, unset }] = useBoolean(props.isEditable);
  const [mentionType, setMentionType] = useState<MentionType>(props.data.type ?? DEFAULT_MENTION_TYPE);

  useShortcut("Escape", () => {
    unset();
  });

  const otherProps = !props.isEditable ? { "data-tooltip": props.data.originalName } : {};

  return (
    <>
      {isMentionPickerOpen && (
        <Popover anchorRef={anchorRef} placement="top-start" onClickOutside={unset} isDisabled={!props.isEditable}>
          <PopPresenceAnimator>
            <MentionTypePicker
              onSelect={(mentionType: MentionType) => {
                setMentionType(mentionType);
                props.update({ type: mentionType });
                unset();
              }}
            />
          </PopPresenceAnimator>
        </Popover>
      )}
      <UIMention mentionType={mentionType} ref={anchorRef} onClick={toggle} {...otherProps}>
        @{props?.data?.originalName}
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
  pickerComponent: UserPicker,
});

// TODO: Build mention colors into theme
const UIMention = styled.span<{ mentionType: MentionType }>`
  cursor: default;
  height: 1.25em;
  padding: 2px 8px;

  ${theme.borderRadius.tag}
  ${theme.font.medium.inter.body12.build}

  ${(props) => {
    switch (props.mentionType) {
      case "notification-only":
        return css`
          color: ${theme.colors.tags.action.foreground()};
          background-color: ${theme.colors.tags.action.background()};
        `;
      case "request-read":
        return css`
          color: ${theme.colors.tags.shareInformation.foreground()};
          background-color: ${theme.colors.tags.shareInformation.background()};
        `;
      case "request-response":
        return css`
          color: ${theme.colors.tags.discussion.foreground()};
          background-color: ${theme.colors.tags.discussion.background()};
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
