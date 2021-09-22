import { Request, Response, Router } from "express";

import { handleAttachmentUpdates } from "~backend/src/attachments/events";
import { extractAndAssertBearerToken } from "~backend/src/authentication";
import { AuthenticationError } from "~backend/src/errors/errorTypes";
import { handleMessageChanges, handleMessageReactionChanges } from "~backend/src/messages/events";
import { handleRoomInvitationCreated, handleRoomMemberCreated } from "~backend/src/roomInvitation/events";
import { handleRoomUpdates } from "~backend/src/rooms/events";
import { handleSpaceUpdates } from "~backend/src/spaces/events";
import { handleTeamInvitationCreated, handleTeamInvitationDeleted } from "~backend/src/teamInvitation/events";
import { handleTeamMemberDeleted } from "~backend/src/teamMember/events";
import { handleTeamUpdates } from "~backend/src/teams/events";
import { handleTopicUpdates } from "~backend/src/topics/events";
import { handleUserCreated } from "~backend/src/users/events";

import { handleTranscriptionUpdates } from "../transcriptions/events";
import { hasuraEvents } from "./eventHandlers";

export const router = Router();

hasuraEvents.addHandler("team_updates", ["INSERT", "UPDATE"], handleTeamUpdates);
hasuraEvents.addHandler("topic_updates", ["UPDATE"], handleTopicUpdates);
hasuraEvents.addHandler("room_updates", ["INSERT", "UPDATE"], handleRoomUpdates);
hasuraEvents.addHandler("team_invitation_updates", "INSERT", handleTeamInvitationCreated);
hasuraEvents.addHandler("team_invitation_updates", "DELETE", handleTeamInvitationDeleted);
hasuraEvents.addHandler("room_invitation_updates", "INSERT", handleRoomInvitationCreated);
hasuraEvents.addHandler("attachment_updates", ["UPDATE"], handleAttachmentUpdates);
hasuraEvents.addHandler("space_updates", ["INSERT", "UPDATE"], handleSpaceUpdates);
hasuraEvents.addHandler("user_updates", ["INSERT"], handleUserCreated);
hasuraEvents.addHandler("room_member_updates", ["INSERT"], handleRoomMemberCreated);
// Create plain text version of each message so it can be used by search views.
hasuraEvents.addHandler("message_updates", ["INSERT", "UPDATE"], handleMessageChanges);
hasuraEvents.addHandler("message_reaction_updates", ["INSERT", "UPDATE", "DELETE"], handleMessageReactionChanges);
hasuraEvents.addHandler("team_member_updates", ["DELETE"], handleTeamMemberDeleted);
hasuraEvents.addHandler("transcription_updates", ["INSERT", "UPDATE"], handleTranscriptionUpdates);

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
