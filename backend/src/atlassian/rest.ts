import * as Sentry from "@sentry/node";
import axios, { AxiosError, AxiosRequestHeaders, AxiosResponse } from "axios";

import { Account, db } from "@aca/db";
import { IS_DEV } from "@aca/shared/dev";
import { logger } from "@aca/shared/logger";

import { getDevPublicTunnelURL } from "../localtunnel";
import { WEBHOOK_PATH } from "./index";
import { GetWatchersResponse, JiraAccountWithAllDetails, JiraWebhookCreationResult } from "./types";
import { refreshTokens } from "./utils";

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

async function getPublicBackendURL() {
  if (IS_DEV) {
    return `${await getDevPublicTunnelURL(3000)}/api/backend`;
  }

  return process.env.BACKEND_API_ENDPOINT;
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

export async function getNewAccessToken(refresh_token: string): Promise<RefreshTokenData> {
  const response = await axios.post(`https://auth.atlassian.com/oauth/token`, {
    grant_type: "refresh_token",
    client_id: process.env.ATLASSIAN_CLIENT_ID,
    client_secret: process.env.ATLASSIAN_CLIENT_SECRET,
    refresh_token,
  });

  return response.data;
}

export async function refreshAccountIfTokenExpired(account: Account) {
  if (!isTokenExpired(account.access_token_expires)) {
    return account;
  }

  logger.info(`Token from account ${account.id} needs refreshing`);

  return refreshTokens(account);
}

export async function jiraRequest<Data>(jiraAccount: JiraAccountWithAllDetails, jiraRequest: JiraRequest<Data>) {
  const { access_token } = await refreshAccountIfTokenExpired(jiraAccount.account);

  const headers = {
    Authorization: `Bearer ${access_token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  let response;

  try {
    response = await jiraRequest(headers, {
      jiraCloudId: jiraAccount.atlassian_site.atlassian_cloud_id,
      jiraAccountId: jiraAccount.account.provider_account_id,
    });
  } catch (e) {
    const error = e as AxiosError;
    if (error.response) {
      logger.error(`Failed making jira api call`);
      logger.error(error.response.data);
      logger.error(error.response.status);
      logger.error(error.response.headers);
    } else if (error.request) {
      logger.error(`Failed making jira api call - no response received`, error.request);
    } else {
      logger.error(`Failed making jira api call - unknown error`, error.message);
    }
    Sentry.captureException(e);
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
