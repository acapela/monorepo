import { Request, Response, Router } from "express";
import { hasuraEvents } from "./eventHandlers";
import { extractAndAssertBearerToken } from "~backend/src/authentication";
import { AuthenticationError } from "~backend/src/errors/errorTypes";
import { handleTeamInvitationCreated, handleTeamInviationDeleted } from "~backend/src/teamInvitation/events";
import { handleRoomUpdates } from "~backend/src/rooms/events";
import { handleTeamUpdates } from "~backend/src/teams/events";
import { handleMessageChanges } from "~backend/src/messages/events";
import { handleSpaceUpdates } from "~backend/src/spaces/events";
import { handleTopicUpdates } from "~backend/src/topics/events";
import { handleUserCreated } from "~backend/src/users/events";
import {
  handleRoomMemberCreated,
  handleRoomInvitationCreated,
  handleRoomInviationDeleted,
} from "~backend/src/roomInvitation/events";
import { handleAttachmentUpdates } from "~backend/src/attachments/events";
import { handleTeamMemberDeleted } from "~backend/src/teamMember/events";
import { handleNotificationCreated } from "~backend/src/notifications/events";

export const router = Router();

hasuraEvents.addHandler("team_updates", ["INSERT", "UPDATE"], handleTeamUpdates);
hasuraEvents.addHandler("topic_updates", ["INSERT", "UPDATE"], handleTopicUpdates);
hasuraEvents.addHandler("room_updates", ["INSERT", "UPDATE"], handleRoomUpdates);
hasuraEvents.addHandler("team_invitation_updates", "INSERT", handleTeamInvitationCreated);
hasuraEvents.addHandler("team_invitation_updates", "DELETE", handleTeamInviationDeleted);
hasuraEvents.addHandler("room_invitation_updates", "INSERT", handleRoomInvitationCreated);
hasuraEvents.addHandler("room_invitation_updates", "DELETE", handleRoomInviationDeleted);
hasuraEvents.addHandler("attachment_updates", ["UPDATE"], handleAttachmentUpdates);
hasuraEvents.addHandler("space_updates", ["INSERT", "UPDATE"], handleSpaceUpdates);
hasuraEvents.addHandler("user_updates", ["INSERT"], handleUserCreated);
hasuraEvents.addHandler("room_member_updates", ["INSERT"], handleRoomMemberCreated);
// Create plain text version of each message so it can be used by search views.
hasuraEvents.addHandler("message_updates", ["INSERT", "UPDATE"], handleMessageChanges);
hasuraEvents.addHandler("team_member_updates", ["DELETE"], handleTeamMemberDeleted);
hasuraEvents.addHandler("notification_updates", ["INSERT"], handleNotificationCreated);

router.post("/v1/events", middlewareAuthenticateHasura, async (req: Request, res: Response) => {
  await hasuraEvents.requestHandler(req, res);
});

function middlewareAuthenticateHasura(req: Request, _: Response, next: () => unknown) {
  const token = extractAndAssertBearerToken(req.get("Authorization") || "");

  if (!token) {
    throw new AuthenticationError("Hasura events call done with invalid secret");
  }

  if (token !== process.env.HASURA_EVENT_SECRET) {
    throw new AuthenticationError("Hasura events call done with invalid secret");
  }
  next();
}
