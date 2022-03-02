import axios, { AxiosError } from "axios";
import { addSeconds } from "date-fns";

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

  return new Date().getTime() > expires_at.getTime();
}

async function refreshAccountIfTokenExpired(account: Account) {
  if (!isTokenExpired(account.access_token_expires)) {
    return account;
  }

  console.info(`Token from account ${account.id} needs refreshing`);

  const response = await axios.post(`https://auth.atlassian.com/oauth/token`, {
    grant_type: "refresh_token",
    client_id: process.env.ATLASSIAN_CLIENT_ID,
    client_secret: process.env.ATLASSIAN_CLIENT_SECRET,
    refresh_token: account.refresh_token,
  });

  const refreshTokenData = response.data as RefreshTokenData;

  console.info(refreshTokenData);

  const updated = await db.account.update({
    where: {
      id: account.id,
    },
    data: {
      access_token: refreshTokenData.access_token,
      access_token_expires: addSeconds(new Date(), refreshTokenData.expires_in),
      refresh_token: refreshTokenData.refresh_token,
    },
  });

  return updated;
}

async function createJiraCommentNotification(payload: JiraWebhookPayload) {
  const { account, jiraAccount } = await getLeastRecentlyUsedAtlassianAccount(payload.matchedWebhookIds[0]);

  const { id: accountId, access_token } = await refreshAccountIfTokenExpired(account);

  assert(access_token, "Accesss token not found for account_id" + account.id);

  const baseApiUrl = `https://api.atlassian.com/ex/jira/${jiraAccount.jira_cloud_id}`;

  //e.g. https://acapela-team.atlassian.net
  const baseSitePath = payload.issue.self.split("/rest")[0];

  const watchers = await getWatchers(access_token, baseApiUrl, payload.issue.key);

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

  console.info("Watchers", watchers);

  const usersToNotify = await db.user.findMany({
    where: {
      account: {
        some: {
          AND: [{ provider_id: "atlassian" }, { provider_account_id: { in: watchers } }],
        },
      },
    },
  });

  console.info(usersToNotify);

  const commentUrl = `${baseSitePath}/browse/${payload.issue.key}?focusedCommentId=${payload.comment?.id}`;

  const notificationPromises = usersToNotify.map((u) =>
    db.notification_jira_issue.create({
      data: {
        notification: {
          create: {
            user_id: u.id,
            url: commentUrl,
            from: payload.comment?.author.displayName ?? "",
          },
        },
        issue_id: payload.issue.id,
        issue_title: payload.issue.fields.summary,
        notification_jira_issue_type: {
          connect: {
            value: "comment_created",
          },
        },
      },
    })
  );

  return await Promise.all(notificationPromises);
}

async function getWatchers(accessToken: string, baseApiUrl: string, issueKey: string) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  let response;
  try {
    console.info(`Getting watchers for ${issueKey}`);
    response = await axios.get(`${baseApiUrl}/rest/api/3/issue/${issueKey}/watchers`, { headers });
  } catch (e) {
    const error = e as AxiosError;
    if (error.response) {
      console.error(`Failed getting watchers for ${issueKey}`);
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);
    } else if (error.request) {
      console.error(`Failed getting watchers for ${issueKey} - no response received`, error.request);
    } else {
      console.error(`Failed getting watchers for ${issueKey} - unknown error`, error.message);
    }
    return [];
  }

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
      id: jiraAccount.account_id,
    },
  });

  assert(account, "account not found for jira account " + jiraAccount.id);

  return {
    account,
    jiraAccount,
  };
}
