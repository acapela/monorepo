import { useState } from "react";
import styled from "styled-components";
import { UserBasicInfoFragment } from "~frontend/gql";
import { useCurrentTeamMembers } from "~frontend/gql/user";
import { SearchInput } from "~ui/forms/SearchInput";
import { Modal } from "~frontend/ui/Modal";
import { UserMedia } from "../users/UserMedia";
import { IconCross } from "~frontend/../../ui/icons";

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
      {currentUsers.length > 0 && (
        <UIMembers>
          {currentUsers.map((user) => {
            return (
              <UIMember>
                <UserMedia user={user} />
                <UIRemoveMember onClick={() => onRemoveUser(user.id)}>
                  <IconCross />
                </UIRemoveMember>
              </UIMember>
            );
          })}
        </UIMembers>
      )}
    </Modal>
  );
}

const UIMembers = styled.div`
  width: 640px;
  border: 1px solid #eae9ea;
  border-radius: 20px;
  @media (max-width: 800px) {
    width: 100px;
  }
`;

const UIMember = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eae9ea;
  :last-child {
    border-bottom: none;
  }
`;

const UIRemoveMember = styled.button`
  padding: 6px;
  background: #f4f4f4;
  cursor: pointer;
  border-radius: 100000px;
`;
