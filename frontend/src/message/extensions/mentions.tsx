import { UserBasicInfoFragment } from "~gql";
import { AutocompletePickerProps } from "~richEditor/autocomplete/component";
import { useCurrentTeamMembers } from "~frontend/gql/teams";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { createAutocompletePlugin } from "~richEditor/autocomplete";
import { SelectList } from "~ui/SelectList";
import { useSearch } from "~shared/search";
import styled from "styled-components";
import { EditorMentionData } from "~shared/types/editor";

/**
 * TODO: This type should be moved to `shared/types` when we'll add backend integration that will pick message mentions
 * to create notifications.
 */

function Picker({ keyword, onSelect }: AutocompletePickerProps<EditorMentionData>) {
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

export const userMentionExtension = createAutocompletePlugin<EditorMentionData>({
  type: "mention",
  triggerChar: "@",
  nodeComponent(props) {
    return <UIMention data-tooltip={props.data.originalName}>@{props?.data?.originalName}</UIMention>;
  },
  pickerComponent: Picker,
});

const UIMention = styled.a`
  cursor: default;
`;

const UISelectItem = styled.div`
  display: flex;
  align-items: center;
  ${UserAvatar} {
    font-size: 1.5rem;
    margin-right: 8px;
  }
`;
