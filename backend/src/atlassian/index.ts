/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { addDays } from "date-fns";
import { Router } from "express";

import { HasuraEvent } from "@aca/backend/src/hasura";
import { getDevPublicTunnelURL } from "@aca/backend/src/localtunnel";
import { Account, db } from "@aca/db";
import { IS_DEV } from "@aca/shared/dev";
import { logger } from "@aca/shared/logger";

import { JiraWebhookPayload } from "./types";

const WEBHOOK_ROUTE = "/atlassian/webhooks";

export const router = Router();

router.post("/v1" + WEBHOOK_ROUTE + "/:accountId", (req, res) => {
  console.info("got a new thing on the hook");
  console.info(req.params);
  const payload = req.body as JiraWebhookPayload;
  console.info(JSON.stringify(payload.issue, null, 2));
  res.json({ wat: true });
});

async function getPublicBackendURL() {
  if (IS_DEV) {
    return `${await getDevPublicTunnelURL(3000)}/api/backend/v1`;
  }

  return process.env.BACKEND_API_ENDPOINT;
}

/*

  When oauth is complete we grab the jira cloudId
  We have a many-to-many relationship table with userId <-> jira_cloud_id
  We add the user to that table

  We create a webhook. 
  We relate the webhook id's with jira's cloud id, 
  the account that created the webhook,
  and put a 29 day expiration date. 
  (webhooks need to be refreshed every 30 days https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-webhooks/#api-rest-api-3-webhook-refresh-put)

  if webhook already created for that cloud_id, 
  then we do nothing.


  Tokens
  - Access Tokens last for 1 hour
  - Refresh Token expire after : 90 days of user inactivity or absolutely in 1 year

  API Call and Token Maintenance

  We have a cron job daily that will refresh tokens that are 90 days old. 
  We can use the accounts `updated_at` field as a date indicator. // Best to add a new field to `account` table
  This won't be so useful for access_token (as they expire after an hour). But instead to avoid the hard expiration
  of refresh tokens.

  ## TODO: needs some work
  When doing any api call e.g. we would like to get the watchers of an issue. 
  We'll first see if the access_token for that user has expired. If it's expired, we'll refresh the access token and
  we'll resume the api call after that.

  Note:
  Registration restrictions -> For an OAuth 2.0 app, A maximum of 5 webhooks per app per user on a tenant.
*/

/**
 * Refresh tokens expire after 90 days according to the Atlassian docs:
 * https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/#use-a-refresh-token-to-get-another-access-token-and-refresh-token-pair
 */
const getRefreshTokenExpiresAt = () => addDays(new Date(), 90).toISOString();

export async function handleAccountUpdates(event: HasuraEvent<Account>) {
  const account = event.item;

  if (!account || account.provider_id !== "atlassian" || event.type != "create") {
    return;
  }

  await db.atlassian_refresh_token_expiry.create({
    data: { account: { connect: { id: account.id } }, expires_at: getRefreshTokenExpiresAt() },
  });

  const headers = {
    Authorization: `Bearer ${account.access_token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  try {
    const { data: resources } = await axios.get("https://api.atlassian.com/oauth/token/accessible-resources", {
      headers,
    });
    for (const { id: cloudId } of resources.filter(({ scopes }: any) =>
      scopes.some((scope: string) => scope.endsWith(":jira"))
    )) {
      const { data: failedWebhooks } = await axios.get(
        `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/webhook/failed`,
        {
          headers,
        }
      );
      console.info({ failedWebhooks });

      const { data } = await axios.get(`https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/webhook`, { headers });

      await axios.delete(`https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/webhook`, {
        headers,
        data: { webhookIds: data.values.map((d: any) => d.id) },
      });

      console.info("earl", (await getPublicBackendURL()) + WEBHOOK_ROUTE);
      console.info({ accountId: account.provider_account_id });
      const res = await axios.post(
        `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/webhook`,
        {
          url: (await getPublicBackendURL()) + WEBHOOK_ROUTE,
          // url: "https://eo86xhndp1v3gy6.m.pipedream.net",
          webhooks: [
            {
              events: ["jira:issue_created", "jira:issue_updated"],
              // This is a fake filter that allows us to get most things
              jqlFilter: "issueKey != NULL-5",
            },
            {
              events: ["comment_created", "comment_updated"],
              // This is a fake filter that allows us to get most things
              jqlFilter: "issueKey != NULL-5",
            },
            {
              events: ["issue_property_set"],
              // This is a fake filter that allows us to get most things
              jqlFilter: "issueKey != NULL-5",
            },
          ],
        },
        {
          headers,
        }
      );
      console.info("jo", JSON.stringify(res.data, null, 2));

      const created = await axios.get(`https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/webhook`, {
        headers,
      });

      console.info("created", JSON.stringify(created.data, null, 2));
    }
  } catch (e: any) {
    console.error("nuh-uh", e);
  }
}

/**
 * Updates all atlassian refresh tokens which expire within the next 7 days
 */
export async function updateAtlassianRefreshToken() {
  const in7Days = addDays(new Date(), 7);
  const accounts = await db.account.findMany({
    where: { atlassian_refresh_token_expiry: { expires_at: { lt: in7Days } } },
  });
  for (const account of accounts) {
    try {
      const response = await axios.post(`https://auth.atlassian.com/oauth/token`, {
        grant_type: "refresh_token",
        client_id: process.env.ATLASSIAN_CLIENT_ID,
        client_secret: process.env.ATLASSIAN_CLIENT_SECRET,
        refresh_token: account.refresh_token,
      });
      await db.account.update({
        where: { id: account.id },
        data: {
          refresh_token: response.data.refresh_token,
          atlassian_refresh_token_expiry: { update: { expires_at: getRefreshTokenExpiresAt() } },
        },
      });
    } catch (error: any) {
      logger.error(error.response, `Failed to refresh token for account ${account.id}`);
    }
  }
}

updateAtlassianRefreshToken();
