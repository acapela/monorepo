import { Request, Response, Router } from "express";

import { extractAndAssertBearerToken } from "@aca/backend/src/authentication";
import { AuthenticationError } from "@aca/backend/src/errors/errorTypes";
import { handleGithubAccountToInstallationChanges } from "@aca/backend/src/github/onboarding";
import { createHasuraEventsHandler } from "@aca/backend/src/hasura";
import {
  Account,
  GithubAccountToInstallation,
  LinearIssue,
  LinearOauthToken,
  NotificationSlackMessage,
  User,
  UserSlackInstallation,
} from "@aca/db";
import { logger } from "@aca/shared/logger";

import { handleAccountUpdates } from "../atlassian";
import { handleLinearIssueChanges, handleLinearOauthTokenCreated } from "../linear/events";
import { handleUserSlackInstallationChanges } from "../slack/capture";
import { handleNotificationSlackMessageChanges } from "../slack/events";
import { handleCreateSyncRequests } from "./handleCreateSyncRequests";

export const router = Router();

logger.info("Initialize hasura event handlers");

const hasuraEvents = createHasuraEventsHandler<{
  account_updates: Account;
  github_account_to_installation_updates: GithubAccountToInstallation;
  linear_issue_updates: LinearIssue;
  notification_slack_message_updates: NotificationSlackMessage;
  linear_oauth_token_updates: LinearOauthToken;
  user_slack_installation_updates: UserSlackInstallation;
  user_updates: User;
}>();

hasuraEvents.addHandler("account_updates", ["INSERT", "UPDATE", "DELETE"], handleAccountUpdates);
hasuraEvents.addHandler("github_account_to_installation_updates", ["INSERT"], handleGithubAccountToInstallationChanges);
hasuraEvents.addHandler("linear_issue_updates", ["INSERT", "UPDATE"], handleLinearIssueChanges);
hasuraEvents.addHandler("linear_oauth_token_updates", ["INSERT"], handleLinearOauthTokenCreated);
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
