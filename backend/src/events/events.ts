import { Request, Response, Router } from "express";

import { extractAndAssertBearerToken } from "@aca/backend/src/authentication";
import { AuthenticationError } from "@aca/backend/src/errors/errorTypes";
import { handleGithubAccountToInstallationChanges } from "@aca/backend/src/github/onboarding";
import { handleGmailAccountUpdates } from "@aca/backend/src/gmail/capture";
import { createHasuraEventsHandler } from "@aca/backend/src/hasura";
import { handleNotificationChanges } from "@aca/backend/src/notification";
import {
  Account,
  GithubAccountToInstallation,
  GmailAccount,
  LinearIssue,
  LinearOauthToken,
  Notification,
  NotificationSlackMessage,
  User,
  UserSlackInstallation,
} from "@aca/db";
import { logger } from "@aca/shared/logger";

import { handleAccountUpdates } from "../atlassian";
import { handleLinearIssueChanges, handleLinearOauthTokenCreated } from "../linear/events";
import { handleNotificationSlackMessageChanges, handleUserSlackInstallationChanges } from "../slack/events";
import { handleCreateSyncRequests } from "./handleCreateSyncRequests";

export const router = Router();

logger.info("Initialize hasura event handlers");

const hasuraEvents = createHasuraEventsHandler<{
  account_updates: Account;
  gmail_account_updates: GmailAccount;
  github_account_to_installation_updates: GithubAccountToInstallation;
  linear_issue_updates: LinearIssue;
  notification_slack_message_updates: NotificationSlackMessage;
  notification_updates: Notification;
  linear_oauth_token_updates: LinearOauthToken;
  user_slack_installation_updates: UserSlackInstallation;
  user_updates: User;
}>();

hasuraEvents.addHandler("account_updates", ["INSERT", "UPDATE", "DELETE"], handleAccountUpdates);
hasuraEvents.addHandler("gmail_account_updates", ["DELETE"], handleGmailAccountUpdates);
hasuraEvents.addHandler("github_account_to_installation_updates", ["INSERT"], handleGithubAccountToInstallationChanges);
hasuraEvents.addHandler("linear_issue_updates", ["INSERT", "UPDATE"], handleLinearIssueChanges);
hasuraEvents.addHandler("linear_oauth_token_updates", ["INSERT"], handleLinearOauthTokenCreated);
hasuraEvents.addHandler("notification_updates", ["UPDATE"], handleNotificationChanges);
hasuraEvents.addHandler("notification_slack_message_updates", ["DELETE"], handleNotificationSlackMessageChanges);
hasuraEvents.addHandler("user_slack_installation_updates", ["INSERT"], handleUserSlackInstallationChanges);
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
