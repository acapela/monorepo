import { useMemo } from "react";
import styled from "styled-components";

import { useCurrentTeamMembers } from "~frontend/gql/user";
import { ScreenCover } from "~frontend/ui/Modal/ScreenCover";
import { UserBasicInfo } from "~frontend/ui/users/UserBasicInfo";
import { UserBasicInfoFragment } from "~gql";
import { PopPresenceAnimator } from "~ui/animations";
import { CircleCloseIconButton } from "~ui/buttons/CircleCloseIconButton";

import { AddMemberInlineForm } from "./AddMemberInlineForm";
import { InvitationPendingIndicator } from "./InvitationPendingIndicator";
import { PanelWithTopbarAndCloseButton } from "./PanelWithTopbarAndCloseButton";
import { UISelectGridContainer } from "./UISelectGridContainer";

interface Invitation {
  email: string;
  id: string;
}

interface Props {
  title: string;
  currentUsers: UserBasicInfoFragment[];
  onCloseRequest: () => void;
  onAddUser: (userId: string) => void;
  onRemoveUser: (userId: string) => void;

  onInviteByEmail?: (email: string) => void;
  invitations?: Invitation[];
  onRemoveInvitation?: (invitationId: string) => void;
}

export function MembersManagerModal({
  currentUsers,
  onCloseRequest,
  onAddUser,
  onRemoveUser,
  title,
  onInviteByEmail,
  invitations = [],
  onRemoveInvitation,
}: Props) {
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
            <AddMemberInlineForm users={potentialUsers} onAddMember={onAddUser} onInviteByEmail={onInviteByEmail} />
            {currentUsers.length > 0 && (
              <UISelectGridContainer>
                {currentUsers.map((user) => (
                  <UIItemHolder key={user.id}>
                    <UserBasicInfo user={user} />
                    <CircleCloseIconButton onClick={() => onRemoveUser(user.id)} />
                  </UIItemHolder>
                ))}
                {invitations.map(({ email, id }) => (
                  <UIItemHolder key={id}>
                    <InvitationPendingIndicator email={email} />
                    {onRemoveInvitation && <CircleCloseIconButton onClick={() => onRemoveInvitation(id)} />}
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

const UIHolder = styled.div<{}>`
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 20px;
  max-height: 80vh;
`;

const UIItemHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 8px;
`;
