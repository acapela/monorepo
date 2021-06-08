import { useState } from "react";
import styled from "styled-components";
import { UserBasicInfoFragment } from "~frontend/gql";
import { useCurrentTeamMembers } from "~frontend/gql/user";
import { UserSelectCard } from "~frontend/ui/users/UserSelectCard";
import { SearchInput } from "~ui/forms/SearchInput";
import { Modal } from "../Modal";

interface Props {
  currentUsers: UserBasicInfoFragment[];
  currentUserLabel?: string;
  onCloseRequest: () => void;
  onUserSelected?: (user: UserBasicInfoFragment) => void;
}

export function UserPickerModal({ currentUsers, currentUserLabel, onCloseRequest, onUserSelected }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const teamMembers = useCurrentTeamMembers();

  return (
    <Modal
      onCloseRequest={onCloseRequest}
      hasCloseButton={false}
      head={{
        title: "Invite people to collaborate together",
        description: "Invite existing team members or add new ones",
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
              actions={<>{isAlreadyPicked && currentUserLabel}</>}
              isDisabled={isAlreadyPicked}
              onSelected={(user) => {
                if (isAlreadyPicked) return;

                onUserSelected?.(user);
              }}
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
