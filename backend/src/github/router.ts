import { createHmac } from "crypto";

import { createNodeMiddleware } from "@octokit/webhooks";
import { Request, Response, Router } from "express";
import { Octokit } from "octokit";
import qs from "qs";

import { BadRequestError } from "@aca/backend/src/errors/errorTypes";
import { HttpStatus } from "@aca/backend/src/http";
import { getUserIdFromRequest } from "@aca/backend/src/utils";
import { db } from "@aca/db";
import { logger } from "@aca/shared/logger";

import { CLIENT_ID, ghApp } from "./app";
import { addWebhookHandlers } from "./webhooks";

export const router = Router();

function getSignedState(uid: string): string {
  const hmac = createHmac("sha256", process.env.GITHUB_OAUTH_SECRET);
  hmac.update(uid);
  return `${uid}:${hmac.digest("hex")}`;
}

addWebhookHandlers(ghApp.webhooks);

router.post("/v1/github/webhook", createNodeMiddleware(ghApp.webhooks, { path: "/v1/github/webhook" }));

router.get("/v1/github/callback", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const { code, setup_action, installation_id, state } = req.query;
  if (!code) throw new BadRequestError("code is missing");
  const installationId = parseInt(installation_id as string, 10);
  if (setup_action === "install" && isNaN(installationId)) throw new BadRequestError("installation_id is invalid");

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
  let user;
  try {
    user = await octokit.request("GET /user");
  } catch (e) {
    logger.error("oauth error: " + e);
    throw new BadRequestError("oauth error");
  }

  if (setup_action !== "install") {
    const validState = getSignedState(userId);
    if (validState !== state) throw new BadRequestError("invalid state");
    // this is the first callback, we have now successfully installed the oauth app
    const pk = {
      user_id: userId,
    };
    await db.github_account.upsert({
      where: pk,
      create: {
        ...pk,
        github_user_id: user.data.id,
        github_login: user.data.login,
      },
      update: {
        github_user_id: user.data.id,
        github_login: user.data.login,
      },
    });
    res.redirect(`https://github.com/apps/${process.env.GITHUB_APP_NAME}/installations/new`);
    return;
  }

  // link installation to user
  const pk = {
    user_id: userId,
    installation_id: installationId,
  };
  await db.github_account_to_installation.upsert({
    where: {
      user_id_installation_id: pk,
    },
    create: pk,
    update: pk,
  });

  res.redirect(`${process.env.FRONTEND_URL}/api/backend/v1/github/done`);
});

router.get("/v1/github/done", async (req: Request, res: Response) => {
  res.status(HttpStatus.OK).send("ok");
});

router.get("/v1/github/link/:installation", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const installationId = parseInt(req.params.installation, 10);
  if (isNaN(installationId)) throw new BadRequestError("installation id is invalid");
  const { org } = req.query;
  if (!org) {
    // no organization, ignore
    res.redirect(`${process.env.FRONTEND_URL}/api/backend/v1/github/done`);
    return;
  }

  const [installation, account, octokit] = await Promise.all([
    db.github_installation.findUnique({ where: { id: installationId } }),
    db.github_account.findUnique({ where: { user_id: userId } }),
    ghApp.getInstallationOctokit(installationId),
  ]);

  if (!installation || installation.target_type !== "Organization" || installation.account_login !== org) {
    throw new BadRequestError("installation id does not exist");
  }
  if (!account) throw new BadRequestError("account does not exist");

  let isMember = false;
  try {
    await octokit.request("GET /orgs/{org}/members/{username}", {
      org,
      username: account.github_login,
    });
    isMember = true;
  } catch (e) {
    logger.error(`member status error (${org}/${account.github_login}): ` + e);
  }
  if (!isMember) throw new BadRequestError("user not member of the organization");

  const pk = {
    user_id: userId,
    installation_id: installationId,
  };
  await db.github_account_to_installation.upsert({
    where: {
      user_id_installation_id: pk,
    },
    create: pk,
    update: pk,
  });
  res.redirect(`${process.env.FRONTEND_URL}/api/backend/v1/github/done`);
});

router.get("/v1/github/auth", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const queryString = qs.stringify({
    client_id: CLIENT_ID,
    state: getSignedState(userId),
  });
  res.redirect(`https://github.com/login/oauth/authorize?${queryString}`);
});

router.get("/v1/github/uninstall", async (req: Request, res: Response) => {
  //TODO: implement
  res.redirect(`https://github.com/apps/${process.env.GITHUB_APP_NAME}/installations/new`);
});
