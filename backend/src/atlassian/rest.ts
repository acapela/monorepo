import axios, { AxiosError, AxiosRequestHeaders, AxiosResponse } from "axios";
import { addSeconds } from "date-fns";

import { Account, db } from "@aca/db";
import { logger } from "@aca/shared/logger";

import { getPublicBackendURL } from "../utils";
import { WEBHOOK_PATH } from "./index";
import { GetWatchersResponse, JiraAccountWithAllDetails, JiraWebhookCreationResult } from "./types";
import { getRefreshTokenExpiresAt } from "./utils";

interface JiraRestMeta {
  jiraCloudId: string;
  jiraAccountId?: string;
}

interface RefreshTokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JiraRequest<Data> = (headers: AxiosRequestHeaders, meta: JiraRestMeta) => Promise<AxiosResponse<Data, any>>;

const jiraBaseApiUrl = `https://api.atlassian.com/ex/jira`;

export function getWebhooks(): JiraRequest<{ values: Array<{ id: string }> }> {
  return async function getWebhooksRest(headers, meta) {
    return await axios.get(`${jiraBaseApiUrl}/${meta.jiraCloudId}/rest/api/3/webhook`, {
      headers,
    });
  };
}

export function createWebhooks(): JiraRequest<JiraWebhookCreationResult> {
  return async function createWebhookRest(headers, meta: { jiraCloudId: string }) {
    return await axios.post(
      `${jiraBaseApiUrl}/${meta.jiraCloudId}/rest/api/3/webhook`,
      {
        url: (await getPublicBackendURL()) + WEBHOOK_PATH,
        webhooks: [
          {
            events: ["comment_created", "comment_updated"],
            // This is a fake filter that allows us to get most things
            jqlFilter: "issueKey != NULL-5",
          },
          {
            events: ["jira:issue_created", "jira:issue_updated"],
            // This is a fake filter that allows us to get most things
            jqlFilter: "issueKey != NULL-5",
          },
        ],
      },
      {
        headers,
      }
    );
  };
}

export function deleteWebhooks(webhookIds: string[]): JiraRequest<void> {
  return async function deleteWebhooksRest(headers, meta) {
    return await axios.delete(`${jiraBaseApiUrl}/${meta.jiraCloudId}/rest/api/3/webhook`, {
      headers,
      data: { webhookIds },
    });
  };
}

export function refreshWebhooks(webhookIds: number[]): JiraRequest<void> {
  return async function refreshWebhooksRest(headers, meta) {
    return await axios.put(`${jiraBaseApiUrl}/${meta.jiraCloudId}/rest/api/3/webhook/refresh`, {
      headers,
      data: { webhookIds },
    });
  };
}

export function getIssueWatchers(issueKey: string): JiraRequest<GetWatchersResponse> {
  return async function getWatchersRest(headers, meta) {
    return await axios.get(`${jiraBaseApiUrl}/${meta.jiraCloudId}/rest/api/3/issue/${issueKey}/watchers`, { headers });
  };
}

export function isTokenExpired(expires_at: Date | string | null) {
  if (!expires_at) {
    return true;
  }

  const expiry = typeof expires_at === "string" ? new Date(expires_at) : expires_at;

  return Date.now() > expiry.getTime();
}

export async function fetchAndSaveNewAccessToken(
  accountId: string,
  previousRefreshToken: string
): Promise<RefreshTokenData> {
  try {
    const response = await axios.post(`https://auth.atlassian.com/oauth/token`, {
      grant_type: "refresh_token",
      client_id: process.env.ATLASSIAN_CLIENT_ID,
      client_secret: process.env.ATLASSIAN_CLIENT_SECRET,
      refresh_token: previousRefreshToken,
    });

    const { refresh_token, access_token, expires_in } = response.data;

    await db.account.update({
      where: { id: accountId },
      data: {
        refresh_token,
        access_token,
        access_token_expires: addSeconds(new Date(), expires_in),
        atlassian_refresh_token_expiry: { update: { expires_at: getRefreshTokenExpiresAt() } },
      },
    });

    return access_token;
  } catch (e: unknown) {
    if ((e as AxiosError).response?.status === 403) {
      // Cannot delete as it will break the app
      const user = await db.account.findUnique({
        where: {
          id: accountId,
        },
        select: {
          user_id: true,
        },
      });

      await db.alert.create({
        data: {
          user: {
            connect: {
              id: user?.user_id ?? "",
            },
          },
          title: "Please Reconnect Jira",
          body: "Your Jira notifications have been paused. You can resume them by reconnecting Jira in the Settings section.",
        },
      });
    }

    throw e;
  }
}

export async function getAccessTokenAndRefreshIfExpired(account: Account) {
  if (!isTokenExpired(account.access_token_expires)) {
    return account.access_token;
  }

  logger.info(`Token from account ${account.id} needs refreshing`);

  return (await fetchAndSaveNewAccessToken(account.id, account.refresh_token ?? "")).access_token;
}

export async function jiraRequest<Data>(jiraAccount: JiraAccountWithAllDetails, requestCallback: JiraRequest<Data>) {
  const access_token = await getAccessTokenAndRefreshIfExpired(jiraAccount.account);

  const headers = {
    Authorization: `Bearer ${access_token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  let response;

  try {
    response = await requestCallback(headers, {
      jiraCloudId: jiraAccount.atlassian_site.atlassian_cloud_id,
      jiraAccountId: jiraAccount.account.provider_account_id,
    });
  } catch (e) {
    const error = e as AxiosError;
    logger.error(
      error,
      `Failed making jira API call` +
        (error.response ? `with status ${error.response.status} and data ${error.response.data}` : "")
    );
  }

  if (response) {
    // This is our input for our round robin mechanism.
    // We're using the least used api endpoint using
    await db.jira_account.update({
      where: {
        account_id_atlassian_site_id: {
          account_id: jiraAccount.account.id,
          atlassian_site_id: jiraAccount.atlassian_site.id,
        },
      },
      data: {
        rest_req_last_used_at: new Date(),
      },
    });
    return response;
  }
  return null;
}
