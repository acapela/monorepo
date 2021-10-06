import { TeamInvitation } from "~db";

import { HasuraEvent } from "../hasura";
import { sendInviteNotification } from "./sendInviteNotification";

export async function handleTeamInvitationCreated({ item: invite, userId }: HasuraEvent<TeamInvitation>) {
  await sendInviteNotification(invite, userId);
}
