import { createHmac } from "crypto";

import Asana from "asana";
import { addSeconds } from "date-fns";
import { Request, Response, Router } from "express";
import * as uuid from "uuid";

import { BadRequestError, NotFoundError } from "@aca/backend/src/errors/errorTypes";
import { HttpStatus } from "@aca/backend/src/http";
import { getUserIdFromRequest } from "@aca/backend/src/utils";
import { listenForWebhooks } from "@aca/backend/src/webhooks";
import { db } from "@aca/db";
import { trackBackendUserEvent } from "@aca/shared/backendAnalytics";
import { logger } from "@aca/shared/logger";

import { getSignedState, getWebhookEndpoint } from "../utils";
import { createClient } from "./utils";
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
  const asanaAccountData = {
    access_token: asanaCredentials.access_token,
    refresh_token: asanaCredentials.refresh_token,
    expires_at: expiresAt,
  };
  // create or update the asana account
  let asanaAccount = await db.asana_account.findFirst({
    where: { user_id: userId, asana_user_id: asanaCredentials.data.gid },
  });
  if (asanaAccount) {
    await db.asana_account.update({
      where: { id: asanaAccount.id },
      data: asanaAccountData,
    });
  } else {
    asanaAccount = await db.asana_account.create({
      data: {
        user_id: userId,
        asana_user_id: asanaCredentials.data.gid,
        ...asanaAccountData,
      },
    });
  }
  // authenticate the client with the current user
  client.useOauth({ credentials: asanaCredentials });

  // the first step is to get all the workspaces for the user
  // TODO: use pagination in the future (we only support max 100 workspaces/projects for now)
  const workspaces = await client.workspaces.findAll({ limit: 100 });
  let existingWebhooks: Asana.resources.Webhooks.Type[] = [];

  // load all projects and existing webhooks
  let projects: Asana.resources.Projects.Type[] = [];
  for (const workspace of workspaces.data) {
    const [pjs, whs] = await Promise.all([
      client.projects.findAll({ workspace: workspace.gid, limit: 100 }),
      client.webhooks.getAll(workspace.gid, { limit: 100 }),
    ]);
    projects = projects.concat(pjs.data.map((p) => ({ ...p, workspace })));
    existingWebhooks = existingWebhooks.concat(whs.data as Asana.resources.Webhooks.Type[]);
  }

  // create webhooks for all projects
  const whEndpoint = await getWebhookEndpoint("asana");
  const createWebhookForProject = async (project: Asana.resources.Projects.Type) => {
    // check if the webhook is already configured
    const existingWebhook = existingWebhooks.find(
      (w) => w.resource.gid === project.gid && w.target.startsWith(whEndpoint)
    );
    // if a webhook for the project already exists, remove it first before we create a new one
    if (existingWebhook) {
      await Promise.all([
        client.webhooks.deleteById(existingWebhook.gid),
        db.asana_webhook.deleteMany({ where: { id: existingWebhook.target.split(whEndpoint + "/")[1] } }),
      ]);
    }

    // we cannot do this in parallel, as the db entry needs to exist before the webhook is created
    // this is a long chain of promises, so it could make the on-boarding very slow for users with many projects
    const dbWebhook = await db.asana_webhook.create({
      data: {
        asana_account_id: asanaAccount!.id,
        project_id: project.gid,
        workspace_id: project.workspace.gid,
        project_name: project.name,
        workspace_name: project.workspace.name,
      },
    });
    const createdWebhook = await client.webhooks.create(project.gid, `${whEndpoint}/${dbWebhook.id}`, {});
    // update database entry again with webhook id
    await db.asana_webhook.update({
      where: { id: dbWebhook.id },
      data: { webhook_id: createdWebhook.gid },
    });
  };
  // end request already, so users won't see a white loading screen for a long time
  res.status(HttpStatus.OK).end();
  trackBackendUserEvent(userId, "Asana Integration Added");
  trackBackendUserEvent(userId, "New Integration Added", { integration: "asana" });
  // TODO: might run here into asana API rate limits
  await Promise.all(projects.map((p) => createWebhookForProject(p)));
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

  const whEndpoint = await getWebhookEndpoint("asana");
  const workspaces = await client.workspaces.findAll({ limit: 100 });
  for (const workspace of workspaces.data) {
    const webhooks = (await client.webhooks.getAll(workspace.gid, { limit: 100 }))
      .data as Asana.resources.Webhooks.Type[];
    await Promise.all(
      webhooks.filter((w) => w.target.startsWith(whEndpoint)).map((w) => client.webhooks.deleteById(w.gid))
    );
  }

  await db.asana_account.deleteMany({ where: { user_id: userId } });

  res.status(HttpStatus.OK).send("ok");
});

// unlink removes a single project from the user
router.get("/v1/asana/unlink/:webhook", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const webhookId = req.params.webhook;
  const [asanaAccount, webhook] = await Promise.all([
    db.asana_account.findFirst({
      where: { user_id: userId },
      include: { asana_webhook: true },
    }),
    db.asana_webhook.findFirst({
      where: { id: webhookId },
    }),
  ]);

  if (!asanaAccount) throw new NotFoundError("asana account not found");
  if (!webhook || !webhook.webhook_id) throw new NotFoundError("asana webhook not found");

  const client = createClient();
  client.useOauth({ credentials: asanaAccount });

  await Promise.all([
    client.webhooks.deleteById(webhook.webhook_id),
    db.asana_webhook.deleteMany({ where: { id: webhookId } }),
  ]);

  res.status(HttpStatus.OK).send("ok");
});

// webhook handler
router.post("/v1/asana/webhook/:id", async (req: Request, res: Response) => {
  const hookSecret = req.headers["x-hook-secret"] as string | undefined;
  if (hookSecret) {
    res.setHeader("x-hook-secret", hookSecret);
  }
  res.status(HttpStatus.OK).end();
  await verifyAndProcess({
    rawBody: req.body,
    signature: req.headers["x-hook-signature"] as string,
    hookSecret,
    webhookId: req.params.id,
  });
});

async function verifyAndProcess({
  rawBody,
  signature,
  hookSecret,
  webhookId,
}: {
  rawBody: string | object;
  signature: string;
  hookSecret?: string;
  webhookId: string;
}) {
  if (!uuid.validate(webhookId)) {
    logger.warn(`invalid webhook id: ${webhookId}`);
    return;
  }
  // the first webhook we get contains an x-hook-secret header
  // we need to save the secret to the database to verify future webhooks
  if (hookSecret) {
    const dbWebhook = await db.asana_webhook.findFirst({ where: { id: webhookId } });
    if (!dbWebhook) {
      logger.warn(`asana webhook ${webhookId} not found`);
      return;
    }
    if (dbWebhook.secret) {
      logger.error(`asana webhook ${webhookId} already has a secret`);
      return;
    }
    await db.asana_webhook.update({
      where: { id: webhookId },
      data: { secret: hookSecret },
    });
    return;
  }

  const dbWebhook = await db.asana_webhook.findFirst({
    where: { id: webhookId },
    include: { asana_account: { include: { user: true } } },
  });
  // check webhook id and secret
  if (!dbWebhook || !dbWebhook.secret) {
    logger.warn(`asana webhook ${webhookId} not found or secret not set`);
    return;
  }

  // verify webhook signature
  const whSignature = createHmac("sha256", dbWebhook.secret!)
    .update(typeof rawBody === "object" ? JSON.stringify(rawBody) : rawBody)
    .digest("hex");
  if (signature !== whSignature) {
    logger.warn("invalid webhook signature");
    return;
  }

  const body = typeof rawBody === "object" ? rawBody : JSON.parse(rawBody);
  // a webhook contains multiple events, process them one by one
  for (const event of body.events) {
    await processEvent(event, dbWebhook);
  }
}

listenForWebhooks("asana", async (rawBody, params, headers) => {
  try {
    await verifyAndProcess({
      rawBody,
      signature: headers["x-hook-signature"],
      hookSecret: headers["x-hook-secret"],
      webhookId: params.id,
    });
  } catch (e) {
    logger.error(e, "error processing asana webhook");
  }
});
