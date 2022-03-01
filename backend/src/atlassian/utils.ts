import axios from "axios";

import { db } from "@aca/db";

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
