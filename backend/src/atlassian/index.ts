import axios from "axios";
import { addDays } from "date-fns";
import { Router } from "express";

import { HasuraEvent } from "@aca/backend/src/hasura";
import { getDevPublicTunnelURL } from "@aca/backend/src/localtunnel";
import { Account, db } from "@aca/db";
import { assert } from "@aca/shared/assert";
import { IS_DEV } from "@aca/shared/dev";

import { captureJiraWebhook } from "./capturing";
import { createWebhooks, deleteWebhooks, getNewAccessToken, getWebhooks, isTokenExpired, jiraRequest } from "./rest";
import { GetResourcesResponse, JiraAccountWithAllDetails, JiraWebhookPayload } from "./types";
import { getRefreshTokenExpiresAt } from "./utils";

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

  await db.atlassian_refresh_token_expiry.create({
    data: { account: { connect: { id: account.id } }, expires_at: getRefreshTokenExpiresAt() },
  });

  const headers = {
    Authorization: `Bearer ${account.access_token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  try {
    // This endpoint allows us to know to which "sites" does the user has granted us access to
    const { data: resources } = await axios.get<GetResourcesResponse>(
      "https://api.atlassian.com/oauth/token/accessible-resources",
      {
        headers,
      }
    );

    // We need to double check that we only target sites that provide the scopes that we need
    const availableSitesWithRequiresScopes = resources.filter(({ scopes }: { scopes: string[] }) =>
      scopes.every((scope: string) => REQUIRED_JIRA_SCOPES.includes(scope))
    );

    for (const atlassianSitePayload of availableSitesWithRequiresScopes) {
      // The attlassian site is what identifies the jira domain we're in
      // e.g. acapela-team.atlassian.net
      const atlassianSite = await db.atlassian_site.upsert({
        where: {
          atlassian_cloud_id: atlassianSitePayload.id,
        },
        update: {},
        create: {
          atlassian_cloud_id: atlassianSitePayload.id,
          name: atlassianSitePayload.name,
          url: atlassianSitePayload.url,
        },
      });

      // The jira account allows us to match the jiraCloudId with the user's account.id
      // This is used for internal maintenance usages, and relating users with incoming webhooks
      const jiraAccount = await db.jira_account.upsert({
        where: {
          account_id_atlassian_site_id: {
            atlassian_site_id: atlassianSite.id,
            account_id: account.id,
          },
        },
        update: {},
        create: {
          account_id: account.id,
          atlassian_site_id: atlassianSite.id,
        },
      });

      const jiraAccountWithAllDetails: JiraAccountWithAllDetails = {
        ...jiraAccount,
        account,
        atlassian_site: atlassianSite,
      };

      // In cases of improper installation or account deletion, there may be registered webhooks for this user's
      // atlassian account.
      // When we see that this account already has webhooks, we'll try to overwrite them
      // we delete the previous webhooks for this user
      // !note: Webhooks created by one user cannot be deleted by another user
      const previouslyCreatedWebhooks = (await jiraRequest(jiraAccountWithAllDetails, getWebhooks()))?.data;
      if (previouslyCreatedWebhooks && previouslyCreatedWebhooks.values.length > 0) {
        const webhookIdsToDelete = previouslyCreatedWebhooks.values.map((d: { id: string }) => d.id);

        await jiraRequest(jiraAccountWithAllDetails, deleteWebhooks(webhookIdsToDelete));

        await db.jira_webhook.deleteMany({
          where: {
            jira_account_id: jiraAccountWithAllDetails.id,
          },
        });
      }

      const previouslyRegisteredWebhooksForJiraCloudId = await db.jira_webhook.findFirst({
        where: {
          jira_account: {
            atlassian_site_id: atlassianSite.atlassian_cloud_id,
          },
        },
      });

      // In the case that some other user registered webhooks for the same jira cloud id, we do nothing
      // as registering them again would mean that we get double submissions from the same event
      if (!previouslyRegisteredWebhooksForJiraCloudId) {
        await registerAndStoreNewWebhooks(jiraAccountWithAllDetails);
      }
    }
  } catch (e) {
    console.error(e);
  }
}

async function handleDeleteAtlassianAccount(account: Account) {
  console.info("Deleting atlassian account");

  const headers = await getHeaders(account);

  // This endpoint allows us to know to which "sites" does the user has granted us access to
  // since the jira_account entity for this account has been already deleted, we need
  // to fetch the necessary "jira_cloud_id"s from jira once more
  const { data: resources } = await axios.get<GetResourcesResponse>(
    "https://api.atlassian.com/oauth/token/accessible-resources",
    {
      headers,
    }
  );

  // We need to double check that we only target sites that provide the scopes that we need
  const availableResourcesWithRequiresScopes = resources.filter(({ scopes }: { scopes: string[] }) =>
    scopes.every((scope: string) => REQUIRED_JIRA_SCOPES.includes(scope))
  );

  for (const { id: jiraCloudId } of availableResourcesWithRequiresScopes) {
    const { data: previouslyCreatedWebhooks } = await getWebhooks()(headers, { jiraCloudId });

    if (previouslyCreatedWebhooks.values.length > 0) {
      const webhookIdsToDelete = previouslyCreatedWebhooks.values.map((d: { id: string }) => d.id);
      await deleteWebhooks(webhookIdsToDelete)(headers, { jiraCloudId });
    }

    const areAccountsRemainingForJiraCloudId =
      (await db.jira_account.count({
        where: {
          atlassian_site_id: jiraCloudId,
        },
      })) > 0;

    if (!areAccountsRemainingForJiraCloudId) {
      // No more webhooks are expected to be received for this cloud id, as there are no more account
      // that depend on webhooks coming in
      return;
    }

    const delegateJiraAccount = await db.jira_account.findFirst({
      where: {
        atlassian_site_id: jiraCloudId,
      },
      orderBy: {
        rest_req_last_used_at: "asc",
      },
      include: {
        account: true,
        atlassian_site: true,
      },
    });

    assert(delegateJiraAccount, "delegate jira account not found");

    await registerAndStoreNewWebhooks(delegateJiraAccount);
  }
}

async function registerAndStoreNewWebhooks(jiraAccount: JiraAccountWithAllDetails) {
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

  console.info(`Webhooks created successfully for atlassian site ${jiraAccount.atlassian_site.id}`);
}

async function getAccessToken(account: Account): Promise<string> {
  if (!isTokenExpired(account.access_token_expires)) {
    return account.access_token ?? "";
  }

  console.info(`Atlassian access token for acapela account ${account.id} needs refreshing`);

  const refreshTokenData = await getNewAccessToken(account?.refresh_token ?? "");
  return refreshTokenData.access_token;
}

async function getHeaders(account: Account) {
  return {
    Authorization: `Bearer ${await getAccessToken(account)}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}
