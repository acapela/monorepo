import axios from "axios";
import { addDays } from "date-fns";
import { Router } from "express";

import { HasuraEvent } from "@aca/backend/src/hasura";
import { getDevPublicTunnelURL } from "@aca/backend/src/localtunnel";
import { Account, JiraAccount, db } from "@aca/db";
import { assert } from "@aca/shared/assert";
import { IS_DEV } from "@aca/shared/dev";

import { captureJiraWebhook } from "./capturing";
import { createWebhooks, deleteWebhooks, getWebhooks, jiraRequest } from "./rest";
import { JiraWebhookPayload } from "./types";

export const WEBHOOK_ROUTE = "/atlassian/webhooks";

export const router = Router();

router.post("/v1" + WEBHOOK_ROUTE, async (req, res) => {
  console.info("got a new thing on the hook");

  const payload = req.body as JiraWebhookPayload;

  console.info(payload.webhookEvent);

  await captureJiraWebhook(payload);

  res.statusCode = 200;
  res.end();
});

export async function getPublicBackendURL() {
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

  if (account?.provider_id === "atlassian" && event.type === "create") {
    handleCreateAtlassianAccount(account);
    return;
  }

  if (account?.provider_id === "atlassian" && event.type === "delete") {
    handleDeleteAtlassianAccount(account);
    return;
  }
}

async function handleCreateAtlassianAccount(account: Account) {
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
    const availableResourcesWithRequiresScopes = resources.filter(({ scopes }: { scopes: string[] }) =>
      scopes.every((scope: string) => REQUIRED_JIRA_SCOPES.includes(scope))
    );

    for (const { id: jiraCloudId } of availableResourcesWithRequiresScopes) {
      // The jira account allows us to match the jiraCloudId with the user's account.id
      // This is used for internal maintenance usages, and relating users with incoming webhooks
      let jiraAccount = await db.jira_account.findFirst({
        where: {
          jira_cloud_id: jiraCloudId,
          account_id: account.id,
        },
      });

      if (!jiraAccount) {
        jiraAccount = await db.jira_account.create({
          data: {
            jira_cloud_id: jiraCloudId,
            account_id: account.id,
          },
        });
      }

      assert(jiraAccount, "jira account not created correctly");

      // In cases of improper installation or deletion, there may be registered webhooks for this user's account.
      // When we see that this account already has webhooks, we'll try to overwrite them
      // we delete the previous webhooks for ths user
      const { data: previouslyCreatedWebhooks } = await getWebhooks()(headers, { jiraCloudId });

      if (previouslyCreatedWebhooks.values.length > 0) {
        const webhookIdsToDelete = previouslyCreatedWebhooks.values.map((d: { id: string }) => d.id);
        await deleteWebhooks(webhookIdsToDelete)(headers, { jiraCloudId });
      }

      // Delete previously existing stored webhooks
      await db.jira_webhook.deleteMany({
        where: {
          jira_account_id: jiraAccount.id,
        },
      });

      const previouslyRegisteredWebhooksForJiraCloudId = await db.jira_webhook.findFirst({
        where: {
          jira_account: {
            jira_cloud_id: jiraCloudId,
          },
        },
      });

      // In the case that some other user registered webhooks for the same jira cloud id, we do nothing
      // as registering them again would mean that we get double submissions from the same event
      if (previouslyRegisteredWebhooksForJiraCloudId) {
        return;
      }

      // Only register webhooks when there's non found for that jiraCloudId
      await registerAndStoreNewWebhooks(jiraAccount);
    }
  } catch (e) {
    console.error(e);
  }
}

async function handleDeleteAtlassianAccount(account: Account) {
  console.info("Deleting atlassian account");

  const jiraAccounts = await db.jira_account.findMany({
    where: {
      account_id: account.id,
    },
  });

  for (const jiraAccountToRemove of jiraAccounts) {
    // This should delete the jira_account and jira_webhooks for that entry
    await db.jira_account.delete({
      where: {
        id: jiraAccountToRemove.id,
      },
    });

    await deletePreviousWebhooks(jiraAccountToRemove);

    const areAccountsRemainingForJiraCloudId =
      (await db.jira_account.count({
        where: {
          jira_cloud_id: jiraAccountToRemove.jira_cloud_id,
        },
      })) > 0;

    if (!areAccountsRemainingForJiraCloudId) {
      return;
    }

    const delegateJiraAccount = await db.jira_account.findFirst({
      where: {
        jira_cloud_id: jiraAccountToRemove.jira_cloud_id,
      },
      orderBy: {
        rest_req_last_used_at: "asc",
      },
    });

    assert(delegateJiraAccount, "delegate jira account not found");

    registerAndStoreNewWebhooks(delegateJiraAccount);
  }
}

async function registerAndStoreNewWebhooks(jiraAccount: JiraAccount) {
  const registerWebhookResponse = await jiraRequest(jiraAccount, createWebhooks());

  assert(registerWebhookResponse, "unable to register webhook");

  const { webhookRegistrationResult } = registerWebhookResponse.data;

  // TODO: Figure out why this is not working properly
  // await db.jira_webhook.createMany({
  //   data: webhookRegistrationResult
  //     .filter((r) => !!r.createdWebhookId)
  //     .map((r) => ({
  //       jira_account_id: jiraAccount.id,
  //       jira_webhook_id: r.createdWebhookId as number,
  //       expire_at: addDays(new Date(), WEBHOOK_DAYS_UNTIL_EXPIRY - 1).toISOString(),
  //     })),
  // });

  for (const wh of webhookRegistrationResult) {
    await db.jira_webhook.create({
      data: {
        jira_account_id: jiraAccount.id,
        jira_webhook_id: wh.createdWebhookId as number,
        expire_at: addDays(new Date(), WEBHOOK_DAYS_UNTIL_EXPIRY - 1).toISOString(),
      },
    });
  }

  console.info("Webhooks created successfully", JSON.stringify(registerWebhookResponse.data, null, 4));
}

async function deletePreviousWebhooks(jiraAccount: JiraAccount) {
  // In case there's a new installation, we delete the previous webhooks by the user
  const getWebhooksResponse = await jiraRequest(jiraAccount, getWebhooks());

  assert(getWebhooksResponse, "unable to get webhooks");

  const webhookIds = getWebhooksResponse.data.values.map((d) => d.id);

  return await jiraRequest(jiraAccount, deleteWebhooks(webhookIds));
}
