import React from "react";
import { UserBasicInfoFragment } from "~gql";
import { MultipleOptionsDropdown } from "~ui/forms/OptionsDropdown/multiple";
import { useCurrentTeamMembers } from "~frontend/gql/teams";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { IconUsers } from "~ui/icons";
import { getUserDisplayName } from "~frontend/utils/getUserDisplayName";

interface Props {
  selectedMemberIds: string[];
  onChange: (selectedMembers: string[]) => void;
}

export const TeamMembersPicker = ({ selectedMemberIds, onChange }: Props) => {
  const teamMembers = useCurrentTeamMembers();

  const selectedMembers = teamMembers.filter((member) => selectedMemberIds.includes(member.id));

  return (
    <MultipleOptionsDropdown<UserBasicInfoFragment>
      icon={<IconUsers />}
      items={teamMembers}
      selectedItems={selectedMembers}
      onChange={(members) => {
        onChange(members.map((member) => member.id));
      }}
      keyGetter={(user) => user.id}
      labelGetter={getUserDisplayName}
      placeholder="Select participants"
      iconGetter={(user) => <UserAvatar size="small" user={user} />}
    />
  );
};
