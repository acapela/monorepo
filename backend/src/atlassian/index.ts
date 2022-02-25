import { Router } from "express";

import { getDevPublicTunnelURL } from "@aca/backend/src/localtunnel";
import { IS_DEV } from "@aca/shared/dev";

export const router = Router();

const getPublicBackendURL = async () =>
  IS_DEV ? `${await getDevPublicTunnelURL(3000)}/api/backend/v1` : process.env.BACKEND_API_ENDPOINT;

router.get("/atlassian-connect.json", async (req, res) => {
  res.json({
    baseUrl: (await getPublicBackendURL()) + "/atlassian",
    key: "acapela",
    name: "Acapela",
    description: "A connect app that does something",
    vendor: {
      name: "Acapela",
      url: "https://acape.la",
    },
    authentication: {
      type: "none",
    },
    enableLicensing: true,
    scopes: ["read", "write"],
    modules: { webhooks: [{ event: "jira:issue_created", url: "/jira/issue_created" }] },
  });
});

router.post("/jira/issue_created", (req, res) => {
  console.info("webhook for issue created:", req.body);
  res.sendStatus(200);
});
