import { createHmac } from "crypto";

import Asana from "asana";
import { addSeconds } from "date-fns";
import { Request, Response, Router } from "express";

import { BadRequestError, NotFoundError } from "@aca/backend/src/errors/errorTypes";
import { HttpStatus } from "@aca/backend/src/http";
import { getUserIdFromRequest } from "@aca/backend/src/utils";
import { db } from "@aca/db";
import { logger } from "@aca/shared/logger";

import { getSignedState } from "../utils";
import { createClient, getWebhookEndpoint } from "./utils";
import { processEvent } from "./webhooks";

export const router = Router();

router.get("/v1/asana/auth", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const client = createClient();
  // oauth redirect with signed state
  res.redirect(`${client.app.asanaAuthorizeUrl()}&state=${getSignedState(userId, process.env.ASANA_OAUTH_SECRET)}`);
});

// oauth callback endpoint
router.get("/v1/asana/callback", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const { code, state } = req.query;
  if (!code) throw new BadRequestError("code is missing");
  if (!state) throw new BadRequestError("state is missing");
  if (getSignedState(userId, process.env.ASANA_OAUTH_SECRET) !== state) throw new BadRequestError("invalid state");

  const client = createClient();
  let asanaCredentials;
  try {
    // type definitions are not correct, we have to use any here ¯\_(ツ)_/¯
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    asanaCredentials = (await client.app.accessTokenFromCode(code as string)) as any;
  } catch (e) {
    logger.error("oauth error: " + e);
    throw new BadRequestError("oauth error");
  }

  const expiresAt = addSeconds(new Date(), asanaCredentials.expires_in);
  const asanaAccount = {
    access_token: asanaCredentials.access_token,
    refresh_token: asanaCredentials.refresh_token,
    asana_user_id: asanaCredentials.data.gid,
    expires_at: expiresAt,
  };
  // create or update the asana account
  await db.asana_account.upsert({
    where: {
      user_id: userId,
    },
    update: asanaAccount,
    create: {
      user_id: userId,
      ...asanaAccount,
    },
  });
  // authenticate the client with the current user
  client.useOauth({ credentials: asanaCredentials });

  // the first step is to get all the workspaces for the user
  // TODO: use pagination in the future (we only support max 100 workspaces/projects for now)
  const workspaces = await client.workspaces.findAll({ limit: 100 });
  let existingWebhooks: Asana.resources.Webhooks.Type[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  // load all projects and existing webhooks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let projects: any[] = [];
  for (const workspace of workspaces.data) {
    const [pjs, whs] = await Promise.all([
      client.projects.findAll({ workspace: workspace.gid, limit: 100 }),
      client.webhooks.getAll(workspace.gid, { limit: 100 }),
    ]);
    projects = projects.concat(pjs.data.map((p) => ({ ...p, workspace: workspace.gid })));
    existingWebhooks = existingWebhooks.concat(whs.data as Asana.resources.Webhooks.Type[]);
  }

  // create webhooks for all projects
  const whEndpoint = await getWebhookEndpoint();
  for (const project of projects) {
    // check if the webhook is already configured
    const existingWebhook = existingWebhooks.find(
      (w) => w.resource.gid === project.gid && w.target.startsWith(whEndpoint)
    );
    // if a webhook for the project already exists, remove it first before we create a new one
    if (existingWebhook) {
      await Promise.all([
        client.webhooks.deleteById(existingWebhook.gid),
        db.asana_webhook.deleteMany({ where: { id: existingWebhook.target.split(whEndpoint)[1] } }),
      ]);
    }

    // we cannot do this in parallel, as the db entry needs to exist before the webhook is created
    const dbWebhook = await db.asana_webhook.create({
      data: {
        user_id: userId,
        project_id: project.gid,
        workspace_id: project.workspace,
      },
    });
    await client.webhooks.create(project.gid, `${whEndpoint}${dbWebhook.id}`, {});
  }
  res.status(HttpStatus.OK).end();
});

// unlink removes the asana account and all webhooks
router.get("/v1/asana/unlink", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);

  const asanaAccount = await db.asana_account.findFirst({
    where: { user_id: userId },
    include: { asana_webhook: true },
  });

  if (!asanaAccount) throw new NotFoundError("asana account not found");

  const client = createClient();
  client.useOauth({ credentials: asanaAccount });

  const whEndpoint = await getWebhookEndpoint();
  const workspaces = await client.workspaces.findAll({ limit: 100 });
  for (const workspace of workspaces.data) {
    const webhooks = (await client.webhooks.getAll(workspace.gid, { limit: 100 }))
      .data as Asana.resources.Webhooks.Type[];
    await Promise.all(
      webhooks.filter((w) => w.target.startsWith(whEndpoint)).map((w) => client.webhooks.deleteById(w.gid))
    );
  }

  await db.asana_account.deleteMany({ where: { user_id: userId } });

  res.redirect("https://app.asana.com/");
});

// webhook handler
router.post("/v1/asana/webhook/:id", async (req: Request, res: Response) => {
  // the first webhook we get contains an x-hook-secret header
  // we need to save the secret to the database to verify future webhooks
  const hooksSecret = req.headers["x-hook-secret"];
  if (hooksSecret) {
    res.setHeader("x-hook-secret", hooksSecret);
    await db.asana_webhook.update({
      where: { id: req.params.id },
      data: { secret: hooksSecret as string },
    });
    res.status(HttpStatus.OK).end();
    return;
  }

  const dbWebhook = await db.asana_webhook.findFirst({
    where: { id: req.params.id },
    include: { asana_account: { include: { user: true } } },
  });
  // check webhook id and secret
  if (!dbWebhook || !dbWebhook.secret) throw new BadRequestError("webhook id not found in database");

  // verify webhook signature
  const whSignature = createHmac("sha256", dbWebhook.secret!).update(JSON.stringify(req.body)).digest("hex");
  if (req.headers["x-hook-signature"] !== whSignature) throw new BadRequestError("invalid webhook signature");

  // accept webhook
  res.status(HttpStatus.OK).end();

  // a webhook contains multiple events, process them one by one
  for (const event of req.body.events) {
    await processEvent(event, dbWebhook);
  }
});
