import axios from "axios";
import { addDays } from "date-fns";
import { Router } from "express";

import { HasuraEvent } from "@aca/backend/src/hasura";
import { getDevPublicTunnelURL } from "@aca/backend/src/localtunnel";
import { Account, db } from "@aca/db";
import { assert } from "@aca/shared/assert";
import { IS_DEV } from "@aca/shared/dev";

import { captureJiraWebhook } from "./capturing";
import { JiraWebhookCreationResult, JiraWebhookPayload } from "./types";

const WEBHOOK_ROUTE = "/atlassian/webhooks";

export const router = Router();

router.post("/v1" + WEBHOOK_ROUTE, async (req, res) => {
  console.info("got a new thing on the hook");

  const payload = req.body as JiraWebhookPayload;

  console.info(JSON.stringify({ ...payload, fields: null }, null, 2));

  await captureJiraWebhook(payload);

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

const REQUIRED_JIRA_SCOPES = [
  "read:epic:jira-software",
  "delete:webhook:jira",
  "read:avatar:jira",
  "read:comment:jira",
  "read:comment.property:jira",
  "read:field:jira",
  "read:group:jira",
  "read:issue-details:jira",
  "read:issue-type:jira",
  "read:issue.property:jira",
  "read:issue.watcher:jira",
  "read:jql:jira",
  "read:project-role:jira",
  "read:project:jira",
  "read:role:jira",
  "read:status:jira",
  "read:user:jira",
  "read:webhook:jira",
  "write:webhook:jira",
];

const WEBHOOK_DAYS_UNTIL_EXPIRY = 30;

export async function handleAccountUpdates(event: HasuraEvent<Account>) {
  const account = event.item;

  if (!account || account.provider_id !== "atlassian" || event.type != "create") {
    return;
  }

  console.info("Creating atlassian account");
  const headers = {
    Authorization: `Bearer ${account.access_token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  try {
    // This endpoint allows us to know to which "sites" does the user has granted us access to
    const { data: resources } = await axios.get("https://api.atlassian.com/oauth/token/accessible-resources", {
      headers,
    });

    // We need to double check that we only target sites that provide the scopes that we need
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const availableResourcesWithRequiresScopes = resources.filter(({ scopes }: any) =>
      scopes.every((scope: string) => REQUIRED_JIRA_SCOPES.includes(scope))
    );

    for (const { id: cloudId } of availableResourcesWithRequiresScopes) {
      const webhookUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/webhook`;

      // In case there's a new installation, we delete the previous webhooks by the user
      const { data: previouslyCreatedWebhooks } = await axios.get(webhookUrl, { headers });

      await axios.delete(webhookUrl, {
        headers,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: { webhookIds: previouslyCreatedWebhooks.values.map((d: any) => d.id) },
      });

      const res = await axios.post(
        webhookUrl,
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

      let jiraAccount = await db.jira_account.findFirst({
        where: {
          jira_cloud_id: cloudId,
          account_id: account.id,
        },
      });

      if (!jiraAccount) {
        jiraAccount = await db.jira_account.create({
          data: {
            jira_cloud_id: cloudId,
            account_id: account.id,
          },
        });
      }

      assert(jiraAccount, "jira account not created correctly");

      const { webhookRegistrationResult } = res.data as JiraWebhookCreationResult;

      // Delete previously existing stored webhooks
      await db.jira_webhook.deleteMany({
        where: {
          jira_account_id: jiraAccount.id,
        },
      });

      await db.jira_webhook.createMany({
        data: webhookRegistrationResult
          .filter((r) => !!r.createdWebhookId)
          .map((r) => ({
            jira_account_id: jiraAccount?.id ?? "",
            jira_webhook_id: r.createdWebhookId as number,
            expire_at: addDays(new Date(), WEBHOOK_DAYS_UNTIL_EXPIRY - 1).toISOString(),
          })),
      });

      console.info("Webhooks created successfully", JSON.stringify(res.data, null, 4));
    }
  } catch (e) {
    console.error(e);
  }
}
