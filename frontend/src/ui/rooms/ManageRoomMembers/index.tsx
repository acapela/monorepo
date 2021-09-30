import { gql, useApolloClient, useMutation, useSubscription } from "@apollo/client";
import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import { useRef, useState } from "react";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { RoomEntity } from "~frontend/clientdb/room";
import { createRoomInvitation, removeRoomInvitation } from "~frontend/gql/roomInvitations";
import { useDeleteRoom } from "~frontend/gql/rooms";
import { useAssertCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import { JoinToggleButton } from "~frontend/ui/buttons/JoinToggleButton";
import { MembersManagerModal } from "~frontend/ui/MembersManager/MembersManagerModal";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { WarningModal } from "~frontend/utils/warningModal";
import {
  ManageRoomMembers_InvitationsQuery,
  ManageRoomMembers_InvitationsQueryVariables,
  ManageRoomMembers_MembersSubscription,
  ManageRoomMembers_MembersSubscriptionVariables,
  RemoveRoomMemberMutation,
  RemoveRoomMemberMutationVariables,
} from "~gql";
import { assertDefined } from "~shared/assert";
import { handleWithStopPropagation } from "~shared/events";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Button } from "~ui/buttons/Button";
import { CircleIconButton } from "~ui/buttons/CircleIconButton";
import { IconPlus } from "~ui/icons";
import { addToast } from "~ui/toasts/data";

import { openLastPrivateRoomMemberDeletionPrompt } from "./openLastPrivateRoomMemberDeletionPrompt";
import { RoomOwner } from "./RoomOwner";

interface Props {
  room: RoomEntity;
  onCurrentUserLeave?: () => void;
}

export const ManageRoomMembers = withFragments(fragments, ({ room, onCurrentUserLeave }: Props) => {
  const apolloClient = useApolloClient();
  const teamId = useAssertCurrentTeamId();

  const currentUser = useCurrentUser();
  const members = room.members.all;
  const amIMember = room.isCurrentUserMember;

  const [deleteRoom] = useDeleteRoom();
  // TODOC
  const [addRoomMember] = useMutation(
    gql`
      mutation AddRoomMember($roomId: uuid!, $userId: uuid!) {
        insert_room_member_one(object: { room_id: $roomId, user_id: $userId }) {
          room_id
          user_id
        }
      }
    `,
    {
      onCompleted() {
        addToast({ type: "success", title: "Room member was added" });
      },
    }
  );

  const [removeRoomMember] = useMutation<RemoveRoomMemberMutation, RemoveRoomMemberMutationVariables>(
    gql`
      mutation RemoveRoomMember($roomId: uuid!, $userId: uuid!) {
        delete_room_member(where: { room_id: { _eq: $roomId }, user_id: { _eq: $userId } }) {
          affected_rows
        }
      }
    `,
    {
      onCompleted() {
        addToast({ type: "success", title: "Room member was removed" });
      },
    }
  );

  function isLastMemberInRoom() {
    return members.length === 1;
  }

  async function handleJoin(userId: string) {
    await addRoomMember({ variables: { userId, roomId: room.id } });
    trackEvent("Joined Room", { roomId: room.id, userId });
  }

  async function handleLeave(userId: string) {
    const safeCurrentUser = assertDefined(currentUser, "user required");

    if (room.is_private && isLastMemberInRoom()) {
      await openLastPrivateRoomMemberDeletionPrompt({
        room,
        onDeleteRoom(variables) {
          deleteRoom({ variables });
        },
      });
      return;
    }

    await removeRoomMember({ variables: { userId, roomId: room.id } });
    if (onCurrentUserLeave && userId === safeCurrentUser.id) {
      onCurrentUserLeave();
    }
    trackEvent("Left Room", { roomId: room.id, userId });
  }

  const [isPickingUser, { set: openUserPicker, unset: closeUserPicker }] = useBoolean(false);

  const [shouldShowWarning, setShouldShowWarning] = useState(false);

  const requestedEmail = useRef<string | null>(null);

  function closeInviteWarning() {
    setShouldShowWarning(false);
    requestedEmail.current = null;
  }

  function handleInviteByEmail() {
    const email = requestedEmail.current;
    if (!email) return;

    closeInviteWarning();

    const reservedEmails = new Set([
      ...members.map(({ email }) => email),
      // TODOC invitations
      // ...room.invitations.map(({ email }) => email),
    ]);

    if (reservedEmails.has(email)) {
      addToast({ type: "success", title: "The person with this email already invited" });
      return;
    }

    if (!amIMember) {
      addToast({ type: "error", title: "Join the room to invite a new member" });
      return;
    }

    createRoomInvitation({ roomId: room.id, teamId, email });
    trackEvent("Invited To Room", { roomId: room.id, userEmail: email });
  }

  async function handleInviteByEmailRequest(email: string) {
    const { data } = await apolloClient.query<
      ManageRoomMembers_InvitationsQuery,
      ManageRoomMembers_InvitationsQueryVariables
    >({
      query: gql`
        query ManageRoomMembers_invitations($teamId: uuid!, $email: String!) {
          teamInvitations: team_invitation(where: { team_id: { _eq: $teamId }, email: { _eq: $email } }) {
            id
          }
        }
      `,
      variables: { teamId, email },
    });
    requestedEmail.current = email;

    if (data.teamInvitations.length > 0) {
      handleInviteByEmail();
    } else {
      setShouldShowWarning(true);
    }
  }

  function handleRemoveRoomInvitation(invitationId: string) {
    removeRoomInvitation({ id: invitationId });
    trackEvent("Deleted Room Invitation", { roomId: room.id, invitationId });
  }

  const membersExceptOwner = members.filter((member) => member.id !== room.owner_id);

  return (
    <>
      <AnimatePresence>
        {shouldShowWarning && (
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
        {isPickingUser && !shouldShowWarning && (
          <MembersManagerModal
            title={"Invite your team members to this room"}
            currentUsers={members}
            onCloseRequest={closeUserPicker}
            onAddUser={handleJoin}
            onRemoveUser={handleLeave}
            // TODOC
            invitations={[]}
            onRemoveInvitation={handleRemoveRoomInvitation}
            onInviteByEmail={handleInviteByEmailRequest}
          />
        )}
      </AnimatePresence>
      <UIHolder>
        <RoomOwner room={room} />
        <UIMembers onClick={handleWithStopPropagation(openUserPicker)}>
          {membersExceptOwner.length > 0 && <AvatarList users={membersExceptOwner} size="inherit" />}
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
});

const UIHolder = styled.div`
  margin-top: 4px;
  display: flex;
  gap: 16px;
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
