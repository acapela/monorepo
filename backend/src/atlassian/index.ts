/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Router } from "express";

import { HasuraEvent } from "@aca/backend/src/hasura";
import { getDevPublicTunnelURL } from "@aca/backend/src/localtunnel";
import { Account, db } from "@aca/db";
import { IS_DEV } from "@aca/shared/dev";

const WEBHOOK_ROUTE = "/atlassian/webhooks";

export const router = Router();

router.use("/v1" + WEBHOOK_ROUTE, (req, res) => {
  console.info("got a new thing on the hook");
  console.info(req.body);
  res.json({ wat: true });
});

async function getPublicBackendURL() {
  if (IS_DEV) {
    return `${await getDevPublicTunnelURL(3000)}/api/backend/v1`;
  }

  return process.env.BACKEND_API_ENDPOINT;
}

export async function handleAccountUpdates(event: HasuraEvent<Account>) {
  const account = event.item;

  if (account.provider_id !== "atlassian" || event.type != "create") {
    return;
  }

  // try {
  //   const response = await axios.post(`https://auth.atlassian.com/oauth/token`, {
  //     grant_type: "refresh_token",
  //     client_id: process.env.ATLASSIAN_CLIENT_ID,
  //     client_secret: process.env.ATLASSIAN_CLIENT_SECRET,
  //     refresh_token: account.refresh_token,
  //   });
  //   console.info(response.data);
  // } catch (e) {
  //   console.error("yaiks", e.response.data);
  // }

  const headers = {
    Authorization: `Bearer ${account.access_token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  try {
    const { data: resources } = await axios.get("https://api.atlassian.com/oauth/token/accessible-resources", {
      headers,
    });
    for (const { id: cloudId, ...rest } of resources.filter(({ scopes }: any) =>
      scopes.some((scope: string) => scope.endsWith(":jira"))
    )) {
      console.info(rest);
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
      const res = await axios.post(
        `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/webhook`,
        {
          url: "https://eop6tfe7i6tv3n1.m.pipedream.net" || (await getPublicBackendURL()) + WEBHOOK_ROUTE,
          webhooks: [
            {
              events: ["jira:issue_created", "jira:issue_updated", "comment_created", "comment_updated"],
              jqlFilter: [
                "issueKey = SSP-7",
                // "assignee = currentUser()",
                // "issue in watchedIssues()",
                // "project = SSP",
                // "comment ~ currentUser()",
                // "description ~ currentUser()",
              ].join(" OR "),
            },
          ],
        },
        {
          headers: headers,
        }
      );
      console.info("jo", JSON.stringify(res.data, null, 2));
    }
  } catch (e: any) {
    console.error("nuh-uh", e.config.url, e.response.data);
  }
}

setTimeout(
  () =>
    db.account
      .findFirst({ where: { provider_id: "atlassian" } })
      .then((acc) => handleAccountUpdates({ type: "create", item: acc } as any)),
  1000
);
