import { Request, Response, Router } from "express";
import { extractAndAssertBearerToken } from "../authentication";
import { AuthenticationError } from "../errors";
import { handleTeamInvitationCreated } from "../teamInvitation/events";
import { handleRoomUpdates } from "../rooms/events";
import { handleTeamUpdates } from "../teams/events";
import { hasuraEvents } from "./eventHandlers";
import { handleMessageCreated } from "../messages/events";
import { handleSpaceUpdates } from "../spaces/events";

export const router = Router();

hasuraEvents.addHandler("team_updates", ["INSERT", "UPDATE"], handleTeamUpdates);
hasuraEvents.addHandler("room_updates", ["INSERT", "UPDATE"], handleRoomUpdates);
hasuraEvents.addHandler("team_invitation_updates", "INSERT", handleTeamInvitationCreated);
hasuraEvents.addHandler("message_updates", "INSERT", handleMessageCreated);
hasuraEvents.addHandler("space_updates", ["INSERT", "UPDATE"], handleSpaceUpdates);

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
