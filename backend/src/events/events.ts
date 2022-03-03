import { Request, Response, Router } from "express";

import { handleAttachmentUpdates } from "@aca/backend/src/attachments/events";
import { extractAndAssertBearerToken } from "@aca/backend/src/authentication";
import { AuthenticationError } from "@aca/backend/src/errors/errorTypes";
import { handleLinearIssueChanges } from "@aca/backend/src/linear/events";
import { handleMessageChanges } from "@aca/backend/src/messages/events";
import {
  handleTaskSlackMessageChanges,
  handleTeamSlackInstallationUpdates,
  handleUserSlackInstallation,
} from "@aca/backend/src/slack/hasuraEvents";
import { handleTaskChanges } from "@aca/backend/src/tasks/taskHandlers";
import { handleTeamMemberAdded, handleTeamMemberDeleted } from "@aca/backend/src/teamMember/events";
import { handleTeamUpdates } from "@aca/backend/src/teams/events";
import { handleTopicMemberChanges, handleTopicUpdates } from "@aca/backend/src/topics/events";
import { handleUserUpdates } from "@aca/backend/src/users/events";
import { logger } from "@aca/shared/logger";

import { handleAccountUpdates } from "../atlassian";
import { handleTaskDueDateChanges } from "../tasks/messageTaskDueDateHandler";
import { hasuraEvents } from "./eventHandlers";
import { handleCreateSyncRequests } from "./handleCreateSyncRequests";

export const router = Router();

logger.info("Initialize hasura event handlers");

hasuraEvents.addHandler("account_updates", ["INSERT", "UPDATE", "DELETE"], handleAccountUpdates);
hasuraEvents.addHandler("team_updates", ["INSERT", "UPDATE"], handleTeamUpdates);
hasuraEvents.addHandler("team_slack_installation_updates", ["DELETE"], handleTeamSlackInstallationUpdates);
hasuraEvents.addHandler("team_member_slack_updates", ["INSERT"], handleUserSlackInstallation);
hasuraEvents.addHandler("topic_updates", ["INSERT", "UPDATE"], handleTopicUpdates);
hasuraEvents.addHandler("topic_member_updates", ["INSERT"], handleTopicMemberChanges);
hasuraEvents.addHandler("attachment_updates", ["UPDATE"], handleAttachmentUpdates);
// Create plain text version of each message so it can be used by search views.
hasuraEvents.addHandler("message_updates", ["INSERT", "UPDATE", "DELETE"], handleMessageChanges);
hasuraEvents.addHandler("task_updates", ["INSERT", "UPDATE", "DELETE"], handleTaskChanges);
hasuraEvents.addHandler("task_slack_message_updates", ["DELETE"], handleTaskSlackMessageChanges);
hasuraEvents.addHandler("message_task_due_date_updates", ["INSERT", "UPDATE"], handleTaskDueDateChanges);
hasuraEvents.addHandler("team_member_updates", ["DELETE"], handleTeamMemberDeleted);
hasuraEvents.addHandler("team_member_updates", ["INSERT"], handleTeamMemberAdded);
hasuraEvents.addHandler("user_updates", ["INSERT", "UPDATE"], handleUserUpdates);
hasuraEvents.addHandler("linear_issue_updates", ["INSERT", "UPDATE"], handleLinearIssueChanges);
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
