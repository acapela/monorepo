import { useState } from "react";
import styled from "styled-components";
import { UserBasicInfoFragment } from "~gql";
import { useCurrentTeamMembers } from "~frontend/gql/user";
import { UserSelectCard } from "~frontend/ui/users/UserSelectCard";
import { SearchInput } from "~ui/forms/SearchInput";
import { Modal } from "~frontend/ui/Modal";
import { Button } from "~ui/buttons/Button";
interface Props {
  currentUsers: UserBasicInfoFragment[];
  onCloseRequest: () => void;
  onAddUser: (userId: string) => void;
  onRemoveUser: (userId: string) => void;
}

export function UserPickerModal({ currentUsers, onCloseRequest, onAddUser, onRemoveUser }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const teamMembers = useCurrentTeamMembers();

  return (
    <Modal
      onCloseRequest={onCloseRequest}
      hasCloseButton={false}
      head={{
        title: "Room participants",
      }}
    >
      <SearchInput placeholder="Search team members..." value={searchTerm} onChangeText={setSearchTerm} />
      <UIMembers>
        {teamMembers.map((user) => {
          const isAlreadyPicked = currentUsers.some((currentUser) => currentUser.id === user.id);
          return (
            <UserSelectCard
              key={user.id}
              user={user}
              actions={
                <Button onClick={() => (isAlreadyPicked ? onRemoveUser(user.id) : onAddUser(user.id))}>
                  {isAlreadyPicked ? "Remove" : "Add"}
                </Button>
              }
            />
          );
        })}
      </UIMembers>
    </Modal>
  );
}

const UIMembers = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;

  & > * {
    margin-bottom: 1rem;
  }
`;
