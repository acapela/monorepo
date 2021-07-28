import { useState } from "react";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import { useAddRoomMemberMutation, isCurrentUserRoomMember, useRemoveRoomMemberMutation } from "~frontend/gql/rooms";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { assertDefined } from "~shared/assert";
import { RoomDetailedInfoFragment } from "~gql";
import { openLastPrivateRoomMemberDeletionPrompt } from "./openLastPrivateRoomMemberDeletionPrompt";
import { useBoolean } from "~shared/hooks/useBoolean";
import { MembersManagerModal } from "~frontend/ui/MembersManager/MembersManagerModal";
import { handleWithStopPropagation } from "~shared/events";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { CircleIconButton } from "~ui/buttons/CircleIconButton";
import { IconPlus } from "~ui/icons";
import { JoinToggleButton } from "~frontend/ui/buttons/JoinToggleButton";
import { createRoomInvitation, removeRoomInvitation } from "~frontend/gql/roomInvitations";
import { addToast } from "~ui/toasts/data";
import { WarningModal } from "~frontend/utils/warningModal";
import { Button } from "~ui/buttons/Button";

interface Props {
  room: RoomDetailedInfoFragment;
  onCurrentUserLeave?: () => void;
}

export const ManageRoomMembers = ({ room, onCurrentUserLeave }: Props) => {
  const currentUser = useCurrentUser();
  const members = room.members.map((m) => m.user);
  const amIMember = isCurrentUserRoomMember(room);

  const [addRoomMember] = useAddRoomMemberMutation();
  const [removeRoomMember] = useRemoveRoomMemberMutation();

  function isLastMemberInRoom() {
    return room.members.length === 1;
  }

  async function handleJoin(userId: string) {
    await addRoomMember({ userId, roomId: room.id });
  }

  async function handleLeave(userId: string) {
    const safeCurrentUser = assertDefined(currentUser, "user required");

    if (room.is_private && isLastMemberInRoom()) {
      await openLastPrivateRoomMemberDeletionPrompt({ room });
      return;
    }

    await removeRoomMember({ userId, roomId: room.id });
    if (onCurrentUserLeave && userId === safeCurrentUser.id) {
      onCurrentUserLeave();
    }
  }

  const [isPickingUser, { set: openUserPicker, unset: closeUserPicker }] = useBoolean(false);

  const [requestedEmail, setRequestedEmail] = useState<string | null>(null);

  const closeInviteWarning = () => setRequestedEmail(null);

  const handleInviteByEmail = () => {
    const reservedEmails = new Set([
      ...members.map(({ email }) => email),
      ...room.invitations.map(({ email }) => email),
    ]);

    if (reservedEmails.has(requestedEmail)) {
      addToast({ type: "info", content: `The person with this email already invited` });
      return;
    }

    if (!requestedEmail) return;
    createRoomInvitation({ roomId: room.id, email: requestedEmail });

    closeInviteWarning();
  };

  return (
    <>
      <AnimatePresence>
        {requestedEmail && (
          <WarningModal
            warning="Just a heads-up..."
            title="Adding new team member"
            description="Inviting new team member to a room also adds them to your team. This means they will be able to see any open spaces or rooms within the app. Are you sure you want to add them?"
            onCloseRequest={closeInviteWarning}
          >
            <UIWarningOptions>
              <Button kind="outlined" onClick={closeInviteWarning}>
                Will do it later...
              </Button>
              <Button onClick={handleInviteByEmail}>Yes, please add</Button>
            </UIWarningOptions>
          </WarningModal>
        )}
        {isPickingUser && !requestedEmail && (
          <MembersManagerModal
            title={"Invite your team to this room"}
            currentUsers={members}
            onCloseRequest={closeUserPicker}
            onAddUser={handleJoin}
            onRemoveUser={handleLeave}
            invitations={room.invitations}
            onRemoveInvitation={(id) => removeRoomInvitation({ id })}
            onInviteByEmail={setRequestedEmail}
          />
        )}
      </AnimatePresence>
      <UIHolder>
        <UIMembers onClick={handleWithStopPropagation(openUserPicker)}>
          {members.length > 0 && <AvatarList users={members} size="inherit" />}
          {amIMember && (
            <CircleIconButton
              kind="primary"
              onClick={handleWithStopPropagation(openUserPicker)}
              icon={<IconPlus />}
              size="inherit"
              tooltip="Manage members"
            />
          )}
        </UIMembers>
        <UIActions>
          {currentUser && (
            <JoinToggleButton
              isMember={amIMember}
              onJoin={() => handleJoin(currentUser.id)}
              onLeave={() => handleLeave(currentUser.id)}
            />
          )}
        </UIActions>
      </UIHolder>
    </>
  );
};

const UIHolder = styled.div`
  margin-top: 4px;
  display: flex;
  align-items: center;
  width: 100%;
`;

const UIMembers = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4px;
  align-items: center;
  font-size: 24px;
  cursor: pointer;
`;

const UIActions = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const UIWarningOptions = styled.div`
  display: flex;
  gap: 32px;
`;
