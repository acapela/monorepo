import { RefObject } from "react";
import { PopoverMenu } from "~ui/popovers/PopoverMenu";
import { UserBasicInfoFragment } from "~gql";
import { useCurrentTeamMembers } from "~frontend/gql/user";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";

interface Props {
  anchorRef: RefObject<HTMLElement>;
  onCloseRequest: () => void;
  selectedUsers: UserBasicInfoFragment[];
  onUserSelected: (user: UserBasicInfoFragment) => void;
}

export function ParticipantsPickerMenu({ anchorRef, onCloseRequest, onUserSelected }: Props) {
  const teamMembers = useCurrentTeamMembers();
  return (
    <PopoverMenu
      anchorRef={anchorRef}
      options={teamMembers.map((member) => {
        return {
          key: member.id,
          label: member.name ?? "",
          onSelect: () => {
            onUserSelected(member);
          },
          icon: <UserAvatar user={member} size="small" disableNameTooltip />,
        };
      })}
      onCloseRequest={onCloseRequest}
    />
  );
}
