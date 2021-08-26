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
        onSelect({ originalName: user.name!, userId: user.id });
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

type MentionType = "notification-only" | "request-read" | "request-response";

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
      renderItem={([_, mentionLabel]) => {
        return <UISelectItem>{mentionLabel}</UISelectItem>;
      }}
    />
  );
}

function TypedMention(props: PropsWithChildren<AutocompleteNodeProps<EditorMentionData>>) {
  const anchorRef = useRef<HTMLAnchorElement | null>(null);

  const [isMentionPickerOpen, { toggle, unset }] = useBoolean(true);
  const [mentionType, setMentionType] = useState<MentionType>("notification-only");

  useShortcut("Escape", () => {
    unset();
  });

  return (
    <>
      {isMentionPickerOpen && (
        <Popover anchorRef={anchorRef} placement="top-start" onClickOutside={unset} isDisabled={!props.isEditable}>
          <PopPresenceAnimator>
            <MentionTypePicker
              onSelect={(mentionType: MentionType) => {
                setMentionType(mentionType);
                unset();
              }}
            />
          </PopPresenceAnimator>
        </Popover>
      )}
      <UIMention mentionType={mentionType} ref={anchorRef} onClick={toggle}>
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
  ${theme.font.body12.medium.build}

  ${(props) => {
    switch (props.mentionType) {
      case "notification-only":
        return css`
          color: white;
          background-color: ${props.theme?.colors.interactive.notification()};
        `;
      case "request-read":
        return css`
          color: white;
          background: blue;
        `;
      case "request-response":
        return css`
          ${props.theme?.colors.actions.primary.regular()}
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
