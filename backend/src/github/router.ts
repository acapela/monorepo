import { createNodeMiddleware } from "@octokit/webhooks";
import { Request, Response, Router } from "express";
import { App, Octokit } from "octokit";

import { BadRequestError } from "@aca/backend/src/errors/errorTypes";
import { HttpStatus } from "@aca/backend/src/http";
import { getUserIdFromRequest } from "@aca/backend/src/utils";
import { db } from "@aca/db";
import { logger } from "@aca/shared/logger";

export const router = Router();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const PRIVATE_KEY = Buffer.from(process.env.GITHUB_APP_PRIVATE_KEY, "base64").toString("utf-8");
const APP_ID = process.env.GITHUB_APP_ID;

const ghApp = new App({
  appId: APP_ID,
  privateKey: PRIVATE_KEY,
  oauth: {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  },
  webhooks: {
    secret: "todo",
  },
});

router.post("/v1/github/webhook", createNodeMiddleware(ghApp.webhooks, { path: "/v1/github/webhook" }));

ghApp.webhooks.on("installation.created", () => {
  throw new Error("installation creation is handled in the oauth callback");
});

ghApp.webhooks.on("installation.deleted", async (event) => {
  try {
    await Promise.all([
      db.github_installation.deleteMany({
        where: {
          id: event.payload.installation.id,
        },
      }),
      db.github_account.deleteMany({
        where: {
          github_installation_id: event.payload.installation.id,
        },
      }),
    ]);
  } catch (e) {
    logger.error("installation.deleted error: " + e);
  }
});

ghApp.webhooks.on("issue_comment", (event) => {
  console.info(event);
});

router.get("/v1/github/callback", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const { code, setup_action, installation_id } = req.query;
  if (!code) throw new BadRequestError("code is missing");
  if (setup_action !== "install") throw new BadRequestError("setup_action is invalid");
  const installationId = parseInt(installation_id as string, 10);
  if (isNaN(installationId)) throw new BadRequestError("installation_id is invalid");

  let oauthRes;
  try {
    oauthRes = await ghApp.oauth.createToken({
      code: code as string,
    });
  } catch (e) {
    logger.error("oauth error: " + e);
    throw new BadRequestError("oauth error");
  }

  const octokit = new Octokit({ auth: oauthRes.authentication.token });
  let installations, user;
  try {
    [installations, user] = await Promise.all([
      octokit.request("GET /user/installations"),
      octokit.request("GET /user"),
    ]);
  } catch (e) {
    logger.error("oauth error: " + e);
    throw new BadRequestError("oauth error");
  }

  const installation = installations.data.installations.find((i) => i.id === installationId);
  if (!installation) {
    throw new BadRequestError("installation not found");
  }

  await Promise.all([
    db.github_account.create({
      data: {
        github_installation_id: installationId,
        user_id: userId,
        github_user_id: user.data.id,
        github_login: user.data.login,
      },
    }),
    db.github_installation.create({
      data: {
        id: installation.id,
        account_id: installation.target_id,
        account_login: installation.account?.login || "",
        target_type: installation.target_type,
        repository_selection: installation.repository_selection,
      },
    }),
  ]);
  res.status(HttpStatus.OK).end();
});
