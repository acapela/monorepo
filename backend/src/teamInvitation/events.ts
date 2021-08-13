import { db, TeamInvitation } from "~db";
import { HasuraEvent } from "../hasura";
import { sendInviteNotification } from "./sendInviteNotification";

export async function handleTeamInvitationCreated({ item: invite, userId }: HasuraEvent<TeamInvitation>) {
  await sendInviteNotification(invite, userId);
}

export const handleTeamInvitationDeleted = async ({ item: invite }: HasuraEvent<TeamInvitation>) => {
  const { team_id: teamId, email } = invite;

  await db.room_invitation.deleteMany({
    where: {
      team_id: teamId,
      email,
    },
  });
};
