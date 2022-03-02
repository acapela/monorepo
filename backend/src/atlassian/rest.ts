import axios, { AxiosError, AxiosRequestHeaders, AxiosResponse } from "axios";
import { addSeconds } from "date-fns";

import { Account, JiraAccount, db } from "@aca/db";
import { assert } from "@aca/shared/assert";

import { GetWatchersResponse, JiraWebhookCreationResult } from "./types";
import { WEBHOOK_ROUTE, getPublicBackendURL } from ".";

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
        url: (await getPublicBackendURL()) + WEBHOOK_ROUTE,
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

  console.info(`Token from account ${account.id} needs refreshing`);

  const refreshTokenData = await getNewAccessToken(account?.refresh_token ?? "");

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

export async function jiraRequest<Data>(jiraAccount: JiraAccount, jiraRequest: JiraRequest<Data>) {
  const account = await db.account.findFirst({
    where: {
      id: jiraAccount.account_id,
    },
  });

  assert(account, "account not found for jira account " + jiraAccount.id);

  const { access_token } = await refreshAccountIfTokenExpired(account);

  const headers = {
    Authorization: `Bearer ${access_token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  let response;

  try {
    response = await jiraRequest(headers, {
      jiraCloudId: jiraAccount.jira_cloud_id,
      jiraAccountId: account.provider_account_id,
    });
  } catch (e) {
    const error = e as AxiosError;
    if (error.response) {
      console.error(`Failed making jira api call`);
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);
    } else if (error.request) {
      console.error(`Failed making jira api call - no response received`, error.request);
    } else {
      console.error(`Failed making jira api call - unknown error`, error.message);
    }
  }

  if (response) {
    // This is our input for our round robin mechanism.
    // We're using the least used api endpoint using
    await db.jira_account.update({
      where: {
        account_id_jira_cloud_id: {
          account_id: jiraAccount.account_id,
          jira_cloud_id: jiraAccount.jira_cloud_id,
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
