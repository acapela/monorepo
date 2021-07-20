import { useMemo } from "react";
import styled from "styled-components";
import { useCurrentTeamMembers } from "~frontend/gql/user";
import { Modal } from "~frontend/ui/Modal";
import { UserBasicInfoFragment } from "~gql";
import { UsersCombobox } from "./UsersCombobox";
import { MembersContainer } from "./MembersContainer";
import { MemberItem } from "./MemberItem";

interface Props {
  currentUsers: UserBasicInfoFragment[];
  onCloseRequest: () => void;
  onAddUser: (userId: string) => void;
  onRemoveUser: (userId: string) => void;
}

export function UserPickerModal({ currentUsers, onCloseRequest, onAddUser, onRemoveUser }: Props) {
  const teamMembers = useCurrentTeamMembers();

  const potentialUsers = useMemo(() => {
    const currentUsersIdsSet = new Set<string>(currentUsers.map(({ id }) => id));
    return teamMembers.filter(({ id }) => !currentUsersIdsSet.has(id));
  }, [teamMembers, currentUsers]);

  return (
    <Modal
      onCloseRequest={onCloseRequest}
      hasCloseButton={false}
      head={{
        title: "Room participants",
      }}
    >
      <UIHolder>
        <UsersCombobox users={potentialUsers} onSelect={onAddUser} />
        {currentUsers.length > 0 && (
          <MembersContainer>
            {currentUsers.map((user) => (
              <MemberItem key={user.id} user={user} onRemove={() => onRemoveUser(user.id)} />
            ))}
          </MembersContainer>
        )}
      </UIHolder>
    </Modal>
  );
}

const UIHolder = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 20px;
`;
