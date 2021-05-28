import { useState } from "react";
import styled from "styled-components";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { UserBasicInfoFragment } from "~frontend/gql";
import { useTeamMembers } from "~frontend/gql/user";
import { SearchInput } from "~ui/forms/SearchInput";
import { Modal } from "../Modal";
import { UserSelectCard } from "~frontend/ui/users/UserSelectCard";

interface Props {
  currentUsers: UserBasicInfoFragment[];
  currentUserLabel?: string;
  onCloseRequest: () => void;
  onUserSelected?: (user: UserBasicInfoFragment) => void;
}

export function UserPickerModal({ currentUsers, currentUserLabel, onCloseRequest, onUserSelected }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const user = useAssertCurrentUser();

  const [data] = useTeamMembers({ teamId: user.currentTeamId });

  const teamMembers = data?.teamMembers ?? [];

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
  margin-top: 1rem;

  & > * {
    margin-bottom: 1rem;
  }
`;
