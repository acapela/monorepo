import React from "react";
import { useCurrentTeamMembers } from "~frontend/gql/teams";
import { MembersManager } from "~frontend/ui/MembersManager";

interface Props {
  selectedMemberIds: string[];
  onChange: (selectedMemberIds: string[]) => void;
}

export const TeamMembersPicker = ({ selectedMemberIds, onChange }: Props) => {
  const teamMembers = useCurrentTeamMembers();

  const selectedUsers = teamMembers.filter((teamMember) => selectedMemberIds.includes(teamMember.id));

  return (
    <MembersManager
      users={selectedUsers}
      onAddMemberRequest={(userIdToAdd) => {
        onChange([...selectedMemberIds, userIdToAdd]);
      }}
      onRemoveMemberRequest={(userIdToRemove) => {
        onChange(selectedMemberIds.filter((selectedMemberId) => selectedMemberId !== userIdToRemove));
      }}
      hideSelfActions
    />
  );
};
