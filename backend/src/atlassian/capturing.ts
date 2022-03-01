import axios from "axios";

import { Account, JiraAccount, db } from "@aca/db";
import { assert } from "@aca/shared/assert";

import { GetWatchersResponse, JiraWebhookPayload } from "./types";

// type JiraEventTypes = "mentioned" | "comment";

interface RefreshTokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}

export async function captureJiraWebhook(payload: JiraWebhookPayload) {
  if (payload.webhookEvent === "comment_created") {
    await createJiraCommentNotification(payload);
  }
}

function isTokenExpired(expires_at: Date | null) {
  if (!expires_at) {
    return true;
  }

  return new Date().getTime() < expires_at.getTime();
}

async function refreshAccountIfTokenExpired(account: Account) {
  if (!isTokenExpired(account.access_token_expires)) {
    return account;
  }

  const response = await axios.post(`https://auth.atlassian.com/oauth/token`, {
    grant_type: "refresh_token",
    client_id: process.env.ATLASSIAN_CLIENT_ID,
    client_secret: process.env.ATLASSIAN_CLIENT_SECRET,
    refresh_token: account.refresh_token,
  });

  const refreshTokenData = response.data as RefreshTokenData;

  const updated = await db.account.update({
    where: {
      id: account.id,
    },
    data: {
      access_token: refreshTokenData.access_token,
      access_token_expires: new Date(refreshTokenData.expires_in),
      refresh_token: refreshTokenData.refresh_token,
    },
  });

  return updated;
}

async function createJiraCommentNotification(payload: JiraWebhookPayload) {
  const { account, jiraAccount } = await getLeastRecentlyUsedAtlassianAccount(payload.matchedWebhookIds[0]);

  const { id: accountId, access_token } = await refreshAccountIfTokenExpired(account);

  assert(access_token, "Accesss token not found for account_id" + account.id);

  const watchers = await getWatchers(access_token, payload.issue.fields.watches.self);

  // This is our input for our round robin mechanism.
  // We're using the least used api endpoint using
  await db.jira_account.update({
    where: {
      account_id_jira_cloud_id: {
        account_id: accountId,
        jira_cloud_id: jiraAccount.jira_cloud_id,
      },
    },
    data: {
      rest_req_last_used_at: new Date(),
    },
  });

  const usersToNotify = await db.user.findMany({
    where: {
      account: {
        every: {
          AND: [{ provider_id: { equals: "atlassian" } }, { provider_account_id: { in: watchers } }],
        },
      },
    },
  });

  console.info(usersToNotify);

  // const notificationPromises = usersToNotify
  // .map((u) =>
  //   db.notification_linear.create({
  //     data: {
  //       notification: {
  //         create: {
  //           user_id: u.user_id,
  //           url: payload.url || "",
  //           from: actor.name,
  //         },
  //       },
  //       creator_id: actor.id,
  //       type: "Issue",
  //       issue_id: issueData.id,
  //       issue_title: issueData.title,
  //       origin,
  //     },
  //   })
  // );
}

async function getWatchers(accessToken: string, url: string) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const response = await axios.get(url, { headers });

  const watchers = response.data as GetWatchersResponse;

  return watchers.watchers.map((w) => w.accountId);
}

async function getLeastRecentlyUsedAtlassianAccount(
  webhookId: number
): Promise<{ account: Account; jiraAccount: JiraAccount }> {
  const jiraAccount = await db.jira_account.findFirst({
    where: {
      jira_webhook: {
        some: {
          jira_webhook_id: webhookId,
        },
      },
    },
    orderBy: {
      rest_req_last_used_at: "asc",
    },
  });

  assert(jiraAccount, "jira account not found for webhook " + webhookId);

  const account = await db.account.findFirst({
    where: {
      id: jiraAccount.id,
    },
  });

  assert(account, "account not found for jira account " + jiraAccount.id);

  return {
    account,
    jiraAccount,
  };
}
