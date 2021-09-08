import { gql } from "@apollo/client";
import styled from "styled-components";

import { withFragments } from "~frontend/gql/utils";
import { ScreenCover } from "~frontend/ui/Modal/ScreenCover";
import { UserBasicInfo } from "~frontend/ui/users/UserBasicInfo";
import { MembersManagerModal_UserFragment } from "~gql";
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

const fragments = {
  user: gql`
    ${UserBasicInfo.fragments.user}

    fragment MembersManagerModal_user on user {
      id
      ...UserBasicInfo_user
    }
  `,
};
type Props = {
  title: string;
  currentUsers: MembersManagerModal_UserFragment[];
  onCloseRequest: () => void;
  onAddUser: (userId: string) => void;
  onRemoveUser: (userId: string) => void;

  onInviteByEmail?: (email: string) => void;
  invitations?: Invitation[];
  onRemoveInvitation?: (invitationId: string) => void;
};

export const MembersManagerModal = withFragments(
  fragments,
  function MembersManagerModal({
    currentUsers,
    onCloseRequest,
    onAddUser,
    onRemoveUser,
    title,

    onInviteByEmail,
    invitations = [],
    onRemoveInvitation,
  }: Props) {
    return (
      <ScreenCover isTransparent={false} onCloseRequest={onCloseRequest}>
        <PopPresenceAnimator onClick={(event) => event.stopPropagation()}>
          <PanelWithTopbarAndCloseButton title={title} onClose={onCloseRequest}>
            <UIHolder>
              <AddMemberInlineForm
                memberUserIds={currentUsers.map((u) => u.id)}
                onAddMember={onAddUser}
                onInviteByEmail={onInviteByEmail}
              />
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
);

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
