import { Request, Response, Router } from "express";

import { handleAttachmentUpdates } from "~backend/src/attachments/events";
import { extractAndAssertBearerToken } from "~backend/src/authentication";
import { AuthenticationError } from "~backend/src/errors/errorTypes";
import { handleMessageChanges, handleMessageReactionChanges } from "~backend/src/messages/events";
import { handleTaskChanges } from "~backend/src/tasks/taskHandlers";
import { handleTeamMemberDeleted } from "~backend/src/teamMember/events";
import { handleTeamSlackInstallationDelete, handleTeamUpdates } from "~backend/src/teams/events";
import { handleTopicMemberChanges, handleTopicUpdates } from "~backend/src/topics/events";
import { handleUserUpdates } from "~backend/src/users/events";
import { log } from "~shared/logger";

import { handleTaskDueDateChanges } from "../tasks/messageTaskDueDateHandler";
import { hasuraEvents } from "./eventHandlers";
import { handleCreateSyncRequests } from "./handleCreateSyncRequests";

export const router = Router();

log.info("Initialize hasura event handlers");

hasuraEvents.addHandler("team_updates", ["INSERT", "UPDATE"], handleTeamUpdates);
hasuraEvents.addHandler("team_slack_installation_updates", ["DELETE"], handleTeamSlackInstallationDelete);
hasuraEvents.addHandler("topic_updates", ["INSERT", "UPDATE"], handleTopicUpdates);
hasuraEvents.addHandler("topic_member_updates", ["INSERT"], handleTopicMemberChanges);
hasuraEvents.addHandler("attachment_updates", ["UPDATE"], handleAttachmentUpdates);
// Create plain text version of each message so it can be used by search views.
hasuraEvents.addHandler("message_updates", ["INSERT", "UPDATE", "DELETE"], handleMessageChanges);
hasuraEvents.addHandler("message_reaction_updates", ["INSERT", "UPDATE", "DELETE"], handleMessageReactionChanges);
hasuraEvents.addHandler("task_updates", ["INSERT", "UPDATE"], handleTaskChanges);
hasuraEvents.addHandler("message_task_due_date_updates", ["INSERT", "UPDATE"], handleTaskDueDateChanges);
hasuraEvents.addHandler("team_member_updates", ["DELETE"], handleTeamMemberDeleted);
hasuraEvents.addHandler("user_updates", ["INSERT", "UPDATE"], handleUserUpdates);
hasuraEvents.addAnyEventHandler(handleCreateSyncRequests);

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
