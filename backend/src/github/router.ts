import { createNodeMiddleware } from "@octokit/webhooks";
import { Request, Response, Router } from "express";
import { Octokit } from "octokit";

import { BadRequestError } from "@aca/backend/src/errors/errorTypes";
import { HttpStatus } from "@aca/backend/src/http";
import { getUserIdFromRequest } from "@aca/backend/src/utils";
import { db } from "@aca/db";
import { trackBackendUserEvent } from "@aca/shared/backendAnalytics";
import { logger } from "@aca/shared/logger";

import { getSignedState } from "../utils";
import { githubApp, githubOnboardingApp } from "./app";
import { addWebhookHandlers } from "./webhooks";

export const router = Router();

const oauthStateSecret = process.env.GITHUB_OAUTH_SECRET;

addWebhookHandlers(githubApp.webhooks);

router.post("/v1/github/webhook", createNodeMiddleware(githubApp.webhooks, { path: "/v1/github/webhook" }));

const doneEndpoint = `${process.env.FRONTEND_URL}/api/backend/v1/github/done`;

router.get("/v1/github/callback", async (req: Request, res: Response) => {
  let userId;
  try {
    userId = getUserIdFromRequest(req);
  } catch (e) {
    logger.warn(e);
  }

  const { code, setup_action, installation_id, state } = req.query;
  if (!code) throw new BadRequestError("code is missing");
  const installationId = parseInt(installation_id as string, 10);
  if (setup_action === "install" && isNaN(installationId)) throw new BadRequestError("installation_id is invalid");

  let oauthRes;
  try {
    const oauthApp = setup_action ? githubApp.oauth : githubOnboardingApp;
    oauthRes = await oauthApp.createToken({
      code: code as string,
    });
  } catch (e) {
    logger.error("oauth error: " + e);
    throw new BadRequestError("oauth error");
  }

  const authToken = oauthRes.authentication.token;
  const octokit = new Octokit({ auth: authToken });
  let user;
  try {
    user = await octokit.request("GET /user");
  } catch (e) {
    logger.error("oauth error: " + e);
    throw new BadRequestError("oauth error");
  }

  if (setup_action === "request") {
    res.redirect(`${doneEndpoint}?error=install_requested`);
    return;
  }

  // if setup_action is not set we handle it as default oauth callback
  // we will just store the authenticated user here
  if (setup_action !== "install") {
    if (!userId) throw new BadRequestError("session is missing");
    const validState = getSignedState(userId, oauthStateSecret);
    if (validState !== state) throw new BadRequestError("invalid state");
    const pk = {
      user_id: userId,
    };
    await db.github_account.upsert({
      where: pk,
      create: {
        ...pk,
        github_user_id: user.data.id,
        github_login: user.data.login,
        oauth_token: authToken,
      },
      update: {
        github_user_id: user.data.id,
        github_login: user.data.login,
        oauth_token: authToken,
      },
    });
    res.redirect(`https://github.com/apps/${process.env.GITHUB_APP_NAME}/installations/new`);
    return;
  }

  // this callback happens after installing the app
  // now we can save the installation id and link it to the current user
  let installations;
  try {
    installations = await octokit.request("GET /user/installations");
  } catch (e) {
    logger.error("oauth error: " + e);
    throw new BadRequestError("oauth error");
  }

  const installation = installations.data.installations.find((i) => i.id === installationId);

  if (!installation || !installation.account) throw new BadRequestError("installation not found");

  await db.github_installation.create({
    data: {
      installation_id: installationId,
      account_id: installation.account.id!,
      account_login: installation.account.login!,
      target_type: installation.target_type,
      repository_selection: installation.repository_selection,
      // if the userId is missing the session was just created by an admin without an acapela account
      ...(userId
        ? {
            installed_by: userId,
            github_account_to_installation: {
              create: {
                user_id: userId,
              },
            },
          }
        : {}),
    },
  });

  res.redirect(doneEndpoint);
  if (userId) {
    trackBackendUserEvent(userId, "GitHub Integration Added");
  }
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
    githubApp.getInstallationOctokit(installationId),
  ]);

  if (!installation || installation.target_type !== "Organization") {
    throw new BadRequestError("installation id does not exist");
  }
  if (org !== ":missing:permissions:" && installation.account_login !== org) {
    throw new BadRequestError("organization does not match");
  }

  if (!account) throw new BadRequestError("account does not exist");

  let isMember = false;
  try {
    await octokit.request("GET /orgs/{org}/members/{username}", {
      org: installation.account_login,
      username: account.github_login,
    });
    isMember = true;
  } catch (e) {
    logger.error(`member status error (${installation.account_login}/${account.github_login}): ` + e);
  }
  if (!isMember) throw new BadRequestError("user not member of the organization");

  await db.github_installation.update({
    where: { id: installation.id },
    data: {
      updated_at: new Date(),
      github_account_to_installation: {
        upsert: {
          where: {
            user_id_installation_id: {
              user_id: userId,
              installation_id: installation.id,
            },
          },
          update: {},
          create: {
            user_id: userId,
          },
        },
      },
    },
  });
  res.redirect(doneEndpoint);
});

router.get("/v1/github/auth", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  res.redirect(githubOnboardingApp.getWebFlowAuthorizationUrl({ state: getSignedState(userId, oauthStateSecret) }).url);
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

  if (linkedAccounts.length === 1) {
    try {
      await githubApp.octokit.request("DELETE /app/installations/{installation_id}", {
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
