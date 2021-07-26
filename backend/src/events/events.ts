import { Request, Response, Router } from "express";
import { hasuraEvents } from "./eventHandlers";
import { extractAndAssertBearerToken } from "~backend/src/authentication";
import { AuthenticationError } from "~backend/src/errors/errorTypes";
import { handleTeamInvitationCreated } from "~backend/src/teamInvitation/events";
import { handleRoomUpdates } from "~backend/src/rooms/events";
import { handleTeamUpdates } from "~backend/src/teams/events";
import { prepareMessagePlainTextData, handleMessageCreated } from "~backend/src/messages/events";
import { handleSpaceUpdates } from "~backend/src/spaces/events";
import { handleTopicCreated } from "~backend/src/topics/events";
import { handleUserCreated } from "~backend/src/users/events";
import { handleRoomParticipantCreated } from "~backend/src/roomInvitation/events";
import { handleAttachmentUpdates } from "~backend/src/attachments/events";
import { handleTeamMemberDeleted } from "~backend/src/teamMember/events";

export const router = Router();

hasuraEvents.addHandler("team_updates", ["INSERT", "UPDATE"], handleTeamUpdates);
hasuraEvents.addHandler("topic_updates", ["INSERT"], handleTopicCreated);
hasuraEvents.addHandler("room_updates", ["INSERT", "UPDATE"], handleRoomUpdates);
hasuraEvents.addHandler("team_invitation_updates", "INSERT", handleTeamInvitationCreated);
hasuraEvents.addHandler("attachment_updates", ["UPDATE"], handleAttachmentUpdates);
hasuraEvents.addHandler("space_updates", ["INSERT", "UPDATE"], handleSpaceUpdates);
hasuraEvents.addHandler("user_updates", ["INSERT"], handleUserCreated);
hasuraEvents.addHandler("room_member_updates", ["INSERT"], handleRoomParticipantCreated);
// Create plain text version of each message so it can be used by search views.
hasuraEvents.addHandler("message_updates", ["INSERT", "UPDATE"], prepareMessagePlainTextData);
// mentions are part of the message object
hasuraEvents.addHandler("message_updates", ["INSERT"], handleMessageCreated);
hasuraEvents.addHandler("team_member_updates", ["DELETE"], handleTeamMemberDeleted);

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
