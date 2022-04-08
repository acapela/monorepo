import { PrismaClient } from "@prisma/client";

import { assert } from "@aca/shared/assert";

export type {
  Prisma,
  PrismaPromise,
  account as Account,
  atlassian_site as AtlassianSite,
  github_account_to_installation as GithubAccountToInstallation,
  jira_account as JiraAccount,
  jira_webhook as JiraWebhook,
  linear_issue as LinearIssue,
  linear_oauth_token as LinearOauthToken,
  notification as Notification,
  notification_linear as NotificationLinear,
  notification_slack_message as NotificationSlackMessage,
  user as User,
  user_slack_installation as UserSlackInstallation,
  user_slack_channels_by_team as UserSlackChannelsByTeam,
  whitelist as Whitelist,
  github_account as GitHubAccount,
  github_installation as GitHubInstallation,
} from "@prisma/client";

assert(process.env.DB_HOST, "DB_HOST required");
assert(process.env.DB_PORT, "DB_PORT required");
assert(process.env.DB_USER, "DB_USER required");
assert(process.env.DB_PASSWORD, "DB_PASSWORD required");
assert(process.env.DB_NAME, "DB_NAME required");

const prismaDatabaseUrl = `postgresql://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD)}@${
  process.env.DB_HOST
}:${process.env.DB_PORT}/${process.env.DB_NAME}?schema=public&connection_limit=10`;

export const db = new PrismaClient({
  datasources: {
    db: {
      url: prismaDatabaseUrl,
    },
  },
});

declare global {
  /* eslint-disable @typescript-eslint/prefer-namespace-keyword */
  /* eslint-disable @typescript-eslint/no-namespace */
  module globalThis {
    // eslint-disable-next-line no-var
    var dbInstance: PrismaClient | null;
  }
}

/**
 * In dev, this file gets hot-reloaded frequently (on each file change that impacts apis). It means we'll constantly
 * create new instance of db connection.
 *
 * To avoid this we need to save old instance somewhere out of module scope (which is re-created on hot-reload).
 *
 * Let's do globalThis for this.
 */
if (process.env.NODE_ENV === "development") {
  // If there is old instance, disconnect it.
  if (globalThis.dbInstance) {
    globalThis.dbInstance.$disconnect();
    globalThis.dbInstance = null;
  }

  globalThis.dbInstance = db;
}
