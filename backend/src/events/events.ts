import { Request, Response, Router } from "express";

import { extractAndAssertBearerToken } from "@aca/backend/src/authentication";
import { AuthenticationError } from "@aca/backend/src/errors/errorTypes";
import { handleGithubAccountToInstallationChanges } from "@aca/backend/src/github/onboarding";
import { handleGmailAccountUpdates } from "@aca/backend/src/gmail/capture";
import { createHasuraEventsHandler } from "@aca/backend/src/hasura";
import { handleNotificationChanges } from "@aca/backend/src/notification";
import { handleSignup } from "@aca/backend/src/user/handleSignup";
import {
  AcapelaUpdate,
  Account,
  GithubAccountToInstallation,
  GmailAccount,
  LinearIssue,
  LinearOauthToken,
  Notification,
  NotificationSlackMessage,
  User,
  UserSlackChannelsByTeam,
  UserSlackInstallation,
} from "@aca/db";
import { logger } from "@aca/shared/logger";

import { handleAcapelaUpdate } from "../acapelaUpdate/handleAcapelaUpdate";
import { handleAccountUpdates } from "../atlassian";
import { handleLinearIssueChanges, handleLinearOauthTokenCreated } from "../linear/events";
import { handleChannelFilterMigrationSync } from "../slack/channelFilterMigration";
import { handleNotificationSlackMessageChanges, handleUserSlackInstallationChanges } from "../slack/events";
import { handleCreateSyncRequests } from "./handleCreateSyncRequests";

export const router = Router();

logger.info("Initialize hasura event handlers");

const hasuraEvents = createHasuraEventsHandler<{
  acapela_update_created: AcapelaUpdate;
  account_updates: Account;
  gmail_account_updates: GmailAccount;
  github_account_to_installation_updates: GithubAccountToInstallation;
  linear_issue_updates: LinearIssue;
  notification_slack_message_updates: NotificationSlackMessage;
  notification_updates: Notification;
  linear_oauth_token_updates: LinearOauthToken;
  user_slack_installation_updates: UserSlackInstallation;
  user_updates: User;
  user_signup: User;
  channel_filter_migration: UserSlackChannelsByTeam;
}>();

hasuraEvents.addHandler("account_updates", ["INSERT", "UPDATE", "DELETE"], handleAccountUpdates);
hasuraEvents.addHandler("gmail_account_updates", ["DELETE"], handleGmailAccountUpdates);
hasuraEvents.addHandler("github_account_to_installation_updates", ["INSERT"], handleGithubAccountToInstallationChanges);
hasuraEvents.addHandler("linear_issue_updates", ["INSERT", "UPDATE"], handleLinearIssueChanges);
hasuraEvents.addHandler("linear_oauth_token_updates", ["INSERT"], handleLinearOauthTokenCreated);
hasuraEvents.addHandler("notification_updates", ["UPDATE"], handleNotificationChanges);
hasuraEvents.addHandler("notification_slack_message_updates", ["DELETE"], handleNotificationSlackMessageChanges);
hasuraEvents.addHandler("user_slack_installation_updates", ["INSERT"], handleUserSlackInstallationChanges);
hasuraEvents.addHandler("user_signup", ["INSERT"], handleSignup);
hasuraEvents.addHandler("acapela_update_created", ["INSERT"], handleAcapelaUpdate);

// TODO: Temporary Migration! This event should be removed once all users upgraded their App to use the new
// "are_all_channels_included" column in "user_slack_channels_by_team". Migration should probably be done by July 2022.
// Remember to remove it from Hasura as well!
hasuraEvents.addHandler("channel_filter_migration", ["INSERT", "UPDATE"], handleChannelFilterMigrationSync);

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
