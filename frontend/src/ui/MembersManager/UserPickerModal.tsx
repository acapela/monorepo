import { useMemo } from "react";
import styled from "styled-components";
import { useCurrentTeamMembers } from "~frontend/gql/user";
import { UserBasicInfoFragment } from "~gql";
import { AddMemberInlineForm } from "./AddMemberInlineForm";
import { UISelectGridContainer } from "./UISelectGridContainer";
import { UserBasicInfo } from "~frontend/ui/users/UserBasicInfo";
import { PanelWithTopbarAndCloseButton } from "./PanelWithTopbarAndCloseButton";
import { PopPresenceAnimator } from "~ui/animations";
import { ScreenCover } from "~frontend/ui/Modal/ScreenCover";
import { CircleCloseIconButton } from "~ui/buttons/CircleCloseIconButton";

interface Props {
  title: string;
  currentUsers: UserBasicInfoFragment[];
  onCloseRequest: () => void;
  onAddUser: (userId: string) => void;
  onRemoveUser: (userId: string) => void;
}

export function UserPickerModal({ currentUsers, onCloseRequest, onAddUser, onRemoveUser, title }: Props) {
  const teamMembers = useCurrentTeamMembers();

  const potentialUsers = useMemo(() => {
    const currentUsersIdsSet = new Set<string>(currentUsers.map(({ id }) => id));
    return teamMembers.filter(({ id }) => !currentUsersIdsSet.has(id));
  }, [teamMembers, currentUsers]);

  return (
    <ScreenCover isTransparent={false} onCloseRequest={onCloseRequest}>
      <PopPresenceAnimator onClick={(event) => event.stopPropagation()}>
        <PanelWithTopbarAndCloseButton title={title} onClose={onCloseRequest}>
          <UIHolder>
            <AddMemberInlineForm users={potentialUsers} onAddMember={onAddUser} />
            {currentUsers.length > 0 && (
              <UISelectGridContainer>
                {currentUsers.map((user) => (
                  <UIItemHolder>
                    <UserBasicInfo user={user} />
                    <CircleCloseIconButton onClick={() => onRemoveUser(user.id)} />
                  </UIItemHolder>
                ))}
              </UISelectGridContainer>
            )}
          </UIHolder>
        </PanelWithTopbarAndCloseButton>
      </PopPresenceAnimator>
    </ScreenCover>
  );
}

const UIHolder = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 20px;
`;

const UIItemHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 8px;
`;
