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

const doneEndpoint = `${process.env.FRONTEND_URL}/api/backend/v1/github/done`;

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

  let installations;
  try {
    installations = await octokit.request("GET /user/installations");
  } catch (e) {
    logger.error("oauth error: " + e);
    throw new BadRequestError("oauth error");
  }

  const installation = installations.data.installations.find((i) => i.id === installationId);

  if (!installation || !installation.account) throw new BadRequestError("installation not found");

  const installationData = {
    account_id: installation.account.id!,
    account_login: installation.account.login!,
    target_type: installation.target_type,
    repository_selection: installation.repository_selection,
  };

  const dbInstallation = await db.github_installation.upsert({
    where: {
      installation_id: installationId,
    },
    create: {
      installation_id: installationId,
      ...installationData,
    },
    update: {
      ...installationData,
      updated_at: new Date(),
    },
  });

  const pk = {
    user_id: userId,
    installation_id: dbInstallation.id,
  };
  await db.github_account_to_installation.upsert({
    where: {
      user_id_installation_id: pk,
    },
    create: pk,
    update: pk,
  });

  res.redirect(doneEndpoint);
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
    res.redirect(doneEndpoint);
    return;
  }

  const [installation, account, octokit] = await Promise.all([
    db.github_installation.findUnique({ where: { installation_id: installationId } }),
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

  const foundInstallation = await db.github_installation.findFirst({
    where: {
      installation_id: installationId,
    },
  });

  if (!foundInstallation) throw new BadRequestError("installation not found");

  const pk = {
    user_id: userId,
    installation_id: foundInstallation.id,
  };
  await db.github_account_to_installation.upsert({
    where: {
      user_id_installation_id: pk,
    },
    create: pk,
    update: pk,
  });

  // force sync
  await db.github_installation.update({
    where: {
      installation_id: installationId,
    },
    data: {
      updated_at: new Date(),
    },
  });

  res.redirect(doneEndpoint);
});

router.get("/v1/github/auth", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const queryString = qs.stringify({
    client_id: CLIENT_ID,
    state: getSignedState(userId),
  });
  res.redirect(`https://github.com/login/oauth/authorize?${queryString}`);
});

async function unlinkInstallation(userId: string, installationId: number): Promise<void> {
  const installation = await db.github_installation.findFirst({ where: { installation_id: installationId } });

  if (!installation) return;

  const linkedAccounts = await db.github_account_to_installation.findMany({
    where: {
      github_installation: {
        installation_id: installationId,
      },
    },
  });

  const isAllowed = linkedAccounts.find((a) => a.user_id === userId);
  if (!isAllowed) throw new BadRequestError("installation is not linked to the current user");

  if (linkedAccounts.length <= 1) {
    try {
      await ghApp.octokit.request("DELETE /app/installations/{installation_id}", {
        installation_id: installationId,
      });
    } catch (e) {
      logger.error("could not unlink account: " + e);
    }
  }
  try {
    await db.github_account_to_installation.deleteMany({
      where: {
        user_id: userId,
        github_installation: {
          installation_id: installationId,
        },
      },
    });
  } catch (e) {
    logger.error("could not unlink account: " + e);
  }
}

router.get("/v1/github/unlink/:installation", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const installationId = parseInt(req.params.installation, 10);
  if (isNaN(installationId)) throw new BadRequestError("installation id is invalid");

  await unlinkInstallation(userId, installationId);
  res.redirect(doneEndpoint);
});

router.get("/v1/github/unlink", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);

  const linkedInstallations = await db.github_account_to_installation.findMany({
    where: {
      user_id: userId,
    },
    include: {
      github_installation: true,
    },
  });

  // unlink all installations for a user
  for (const i of linkedInstallations) {
    await unlinkInstallation(userId, i.github_installation.installation_id);
  }

  try {
    await db.github_account.delete({
      where: {
        user_id: userId,
      },
    });
  } catch (e) {
    logger.error("could not unlink account: " + e);
  }
  res.redirect(doneEndpoint);
});
