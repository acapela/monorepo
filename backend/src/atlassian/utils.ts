import * as Sentry from "@sentry/node";
import axios from "axios";
import { addDays, addSeconds } from "date-fns";

import { Account, db } from "@aca/db";
import { logger } from "@aca/shared/logger";

import { getNewAccessToken, jiraRequest, refreshWebhooks } from "./rest";
import { handleAccountUpdates } from ".";

export async function deleteAllJiraWebhooks() {
  for (const account of await db.account.findMany({
    where: {
      provider_id: "atlassian",
    },
  })) {
    const headers = {
      Authorization: `Bearer ${account.access_token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const { data: resources } = await axios.get("https://api.atlassian.com/oauth/token/accessible-resources", {
      headers,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

      const { data: previouslyCreatedWebhooks } = await axios.get(
        `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/webhook`,
        { headers }
      );

      console.info(`Deleting atlassian webhooks for cloudId ${cloudId}`, { webhooksData: previouslyCreatedWebhooks });

      await axios.delete(`https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/webhook`, {
        headers,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: { webhookIds: previouslyCreatedWebhooks.values.map((d: any) => d.id) },
      });
    }
  }
}

export async function __simulateNewAtlassianAccountCreation(provider_account_id: string) {
  const account = await db.account.findFirst({
    where: {
      provider_account_id,
    },
  });

  if (!account) {
    return;
  }

  handleAccountUpdates({
    userId: account?.user_id,
    date: new Date(),
    item: account,
    itemBefore: null,
    tableName: "account",
    type: "create",
  });
}

/**
 * Refresh tokens expire after 90 days according to the Atlassian docs:
 * https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/#use-a-refresh-token-to-get-another-access-token-and-refresh-token-pair
 */
export const getRefreshTokenExpiresAt = () => addDays(new Date(), 90).toISOString();

export async function refreshTokens(account: Account) {
  const { refresh_token, access_token, expires_in } = await getNewAccessToken(account.refresh_token ?? "");

  return await db.account.update({
    where: { id: account.id },
    data: {
      refresh_token,
      access_token,
      access_token_expires: addSeconds(new Date(), expires_in),
      atlassian_refresh_token_expiry: { update: { expires_at: getRefreshTokenExpiresAt() } },
    },
  });
}

export async function refreshExpiringAtlassianProperties() {
  await updateAtlassianRefreshToken();
  await refreshAtlassianWebhooks();
}

/**
 * Updates all atlassian refresh tokens which expire within the next 2 days
 */
async function updateAtlassianRefreshToken() {
  const in2Days = addDays(new Date(), 2);
  const accounts = await db.account.findMany({
    where: { atlassian_refresh_token_expiry: { expires_at: { lt: in2Days } } },
  });
  for (const account of accounts) {
    try {
      await refreshTokens(account);
    } catch (error) {
      logger.error(error, `Failed to refresh token for account ${account.id}`);
      Sentry.captureException(error);
    }
  }
}

/**
 * Updates all atlassian webhooks tokens which expire within the next 2 days
 */
async function refreshAtlassianWebhooks() {
  const in2Days = addDays(new Date(), 2);

  const webhookAccounts = await db.jira_account.findMany({
    where: {
      jira_webhook: {
        some: {
          expire_at: {
            lt: in2Days,
          },
        },
      },
    },
    include: {
      account: true,
      atlassian_site: true,
      jira_webhook: true,
    },
  });

  for (const { jira_webhook, ...jiraAccountWithAllDetails } of webhookAccounts) {
    const soonToExpireWebhookIds = jira_webhook.map((wa) => wa.jira_webhook_id);
    await jiraRequest(jiraAccountWithAllDetails, refreshWebhooks(soonToExpireWebhookIds));
  }
}
