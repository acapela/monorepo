import { createHmac } from "crypto";

import { createNodeMiddleware } from "@octokit/webhooks";
import { Request, Response, Router } from "express";
import { App, Octokit } from "octokit";
import qs from "qs";

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

ghApp.webhooks.on("installation.deleted", async (event) => {
  try {
    await Promise.all([
      db.github_installation.deleteMany({
        where: {
          id: event.payload.installation.id,
        },
      }),
      db.github_account_to_installation.deleteMany({
        where: {
          installation_id: event.payload.installation.id,
        },
      }),
    ]);
  } catch (e) {
    logger.error("installation.deleted error: " + e);
  }
});

ghApp.webhooks.on("installation.created", async (event) => {
  await db.github_installation.create({
    data: {
      id: event.payload.installation.id,
      account_id: event.payload.installation.target_id,
      account_login: event.payload.installation.account.login,
      target_type: event.payload.installation.target_type,
      repository_selection: event.payload.installation.repository_selection,
    },
  });
});

// for now we only support mentions in newly created comments
ghApp.webhooks.on("issue_comment.created", async (event) => {
  console.info("issue_comment", event.payload);
  const installationId = event.payload.installation?.id;
  if (!installationId) throw new Error("installation id is missing");
  const ghAccounts = await db.github_account_to_installation.findMany({
    where: {
      installation_id: installationId,
    },
  });
  const notificationPromises = ghAccounts.map((a) =>
    db.notification_github.create({
      data: {
        notification: {
          create: {
            user_id: a.user_id,
            url: event.payload.comment.html_url,
            from: event.payload.comment.user.login,
          },
        },
        type: "Comment",
        issue_id: event.payload.issue.id,
        issue_title: event.payload.issue.title,
      },
    })
  );
  await Promise.all(notificationPromises);
});

ghApp.webhooks.on("issues.assigned", (event) => {
  console.info("issues.assigned", event.payload);
});

ghApp.webhooks.on("issues.opened", (event) => {
  console.info("issues.opened", event.payload);
});

ghApp.webhooks.on("pull_request.assigned", (event) => {
  console.info("pull_request.assigned", event.payload);
});

ghApp.webhooks.on("pull_request.opened", (event) => {
  console.info("pull_request.opened", event.payload);
});

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
    res.redirect("https://github.com/apps/acapela-test/installations/new");
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

router.get("/v1/github/uninstall", async (req: Request, res: Response) => {
  //TODO
  res.redirect("https://github.com/apps/acapela-test/installations/new");
});

function getSignedState(uid: string): string {
  const hmac = createHmac("sha256", "asdasdasdadsddsddsdsdds");
  hmac.update(uid);
  return `${uid}:${hmac.digest("hex")}`;
}

router.get("/v1/github/auth", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const queryString = qs.stringify({
    client_id: CLIENT_ID,
    state: getSignedState(userId),
  });
  res.redirect(`https://github.com/login/oauth/authorize?${queryString}`);
});
