import { Request, Response, Router } from "express";

import { extractAndAssertBearerToken } from "@aca/backend/src/authentication";
import { AuthenticationError } from "@aca/backend/src/errors/errorTypes";
import { createHasuraEventsHandler } from "@aca/backend/src/hasura";
import { Account, LinearIssue, Notification, NotificationSlackMessage, User } from "@aca/db";
import { logger } from "@aca/shared/logger";

import { handleAccountUpdates } from "../atlassian";
import { handleLinearIssueChanges } from "../linear/events";
import { handleNotificationChanges } from "../notification";
import { handleNotificationSlackMessageChanges } from "../slack/events";
import { handleCreateSyncRequests } from "./handleCreateSyncRequests";

export const router = Router();

logger.info("Initialize hasura event handlers");

const hasuraEvents = createHasuraEventsHandler<{
  account_updates: Account;
  linear_issue_updates: LinearIssue;
  notification_updates: Notification;
  notification_slack_message_updates: NotificationSlackMessage;
  user_updates: User;
}>();

hasuraEvents.addHandler("account_updates", ["INSERT", "UPDATE", "DELETE"], handleAccountUpdates);
hasuraEvents.addHandler("linear_issue_updates", ["INSERT", "UPDATE"], handleLinearIssueChanges);
hasuraEvents.addHandler("notification_updates", ["UPDATE"], handleNotificationChanges);
hasuraEvents.addHandler("notification_slack_message_updates", ["DELETE"], handleNotificationSlackMessageChanges);
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
