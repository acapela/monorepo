import { useMemo } from "react";
import styled from "styled-components";
import { UserBasicInfoFragment } from "~gql";
import { useCurrentTeamMembers } from "~frontend/gql/user";
import { Modal } from "~frontend/ui/Modal";
import { UserBasicInfo } from "../users/UserBasicInfo";
import { IconCross } from "~ui/icons";
import { UsersCombobox } from "./UsersCombobox";
import { BACKGROUND_ACCENT } from "~ui/colors";

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
          <UIMembers>
            {currentUsers.map((user) => {
              return (
                <UIMember>
                  <UserBasicInfo user={user} />
                  <UIRemoveMemberButton onClick={() => onRemoveUser(user.id)}>
                    <IconCross />
                  </UIRemoveMemberButton>
                </UIMember>
              );
            })}
          </UIMembers>
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

const UIMembers = styled.div`
  width: 640px;
  border: 1px solid ${BACKGROUND_ACCENT};
  border-radius: 20px;
  @media (max-width: 800px) {
    width: 100%;
  }
`;

const UIMember = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${BACKGROUND_ACCENT};
  :last-child {
    border-bottom: none;
  }
`;

const UIRemoveMemberButton = styled.button`
  padding: 6px;
  background: ${BACKGROUND_ACCENT};
  cursor: pointer;
  border-radius: 100000px;
`;
