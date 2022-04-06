import { createHmac } from "crypto";

import Asana from "asana";
import { addSeconds } from "date-fns";
import { Request, Response, Router } from "express";
import { v4 as uuidv4 } from "uuid";

import { BadRequestError, NotFoundError } from "@aca/backend/src/errors/errorTypes";
import { HttpStatus } from "@aca/backend/src/http";
import { getDevPublicTunnelURL } from "@aca/backend/src/localtunnel";
import { getUserIdFromRequest } from "@aca/backend/src/utils";
import { db } from "@aca/db";
import { IS_DEV } from "@aca/shared/dev";
import { logger } from "@aca/shared/logger";

import { getSignedState } from "../utils";

const { ASANA_OAUTH_SECRET, ASANA_CLIENT_ID, ASANA_CLIENT_SECRET } = process.env;

function createClient() {
  return Asana.Client.create({
    clientId: ASANA_CLIENT_ID,
    clientSecret: ASANA_CLIENT_SECRET,
    redirectUri: `${process.env.FRONTEND_URL}/api/backend/v1/asana/callback`,
  });
}

async function getWebhookEndpoint(): Promise<string> {
  return `${IS_DEV ? await getDevPublicTunnelURL(3000) : process.env.FRONTEND_URL}/api/backend/v1/asana/webhook`;
}

export const router = Router();

router.get("/v1/asana/auth", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const client = createClient();
  res.redirect(`${client.app.asanaAuthorizeUrl()}&state=${getSignedState(userId, ASANA_OAUTH_SECRET)}`);
});

router.get("/v1/asana/callback", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const { code, state } = req.query;
  if (!code) throw new BadRequestError("code is missing");
  if (!state) throw new BadRequestError("state is missing");
  const validState = getSignedState(userId, ASANA_OAUTH_SECRET);
  if (validState !== state) throw new BadRequestError("invalid state");

  const client = createClient();
  let asanaCredentials;
  try {
    // types are not correct, we have to use any here ¯\_(ツ)_/¯
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
  client.useOauth({ credentials: asanaCredentials });

  // we only support max 100 workspaces/projects for now
  const workspaces = await client.workspaces.findAll({ limit: 100 });
  let existingWebhooks: Asana.resources.Webhooks.Type[] = [];
  let projects: Asana.resources.Projects.Type[] = [];
  for (const workspace of workspaces.data) {
    const [pjs, whs] = await Promise.all([
      client.projects.findAll({ workspace: workspace.gid, limit: 100 }),
      client.webhooks.getAll(workspace.gid, { limit: 100 }),
    ]);
    projects = projects.concat(pjs.data);
    existingWebhooks = existingWebhooks.concat(whs.data as Asana.resources.Webhooks.Type[]);
  }

  const whEndpoint = await getWebhookEndpoint();
  for (const project of projects) {
    // check if the webhook is already configured
    if (existingWebhooks.find((w) => w.resource.gid === project.gid && w.target.startsWith(whEndpoint))) continue;
    const whId = uuidv4();
    // we cannot do this in parallel, as the db entry needs to exist before the webhook is created
    await db.asana_webhook.create({ data: { id: whId, user_id: userId } });
    await client.webhooks.create(project.gid, `${whEndpoint}/${whId}`, {});
  }
  res.status(HttpStatus.OK).end();
});

router.get("/v1/asana/unlink", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);

  const asanaAccount = await db.asana_account.findFirst({
    where: {
      user_id: userId,
    },
    include: {
      asana_webhook: true,
    },
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

  await db.asana_account.deleteMany({
    where: {
      user_id: userId,
    },
  });

  res.redirect("https://app.asana.com/");
});

router.post("/v1/asana/webhook/:id", async (req: Request, res: Response) => {
  const hooksSecret = req.headers["x-hook-secret"];
  if (hooksSecret) {
    res.setHeader("x-hook-secret", hooksSecret);
    await db.asana_webhook.update({
      where: {
        id: req.params.id,
      },
      data: {
        secret: hooksSecret as string,
      },
    });
    res.status(HttpStatus.OK).end();
    return;
  }
  const dbWebhook = await db.asana_webhook.findFirst({
    where: { id: req.params.id },
    include: {
      asana_account: true,
    },
  });
  if (!dbWebhook || !dbWebhook.secret) throw new BadRequestError("webhook id not found in database");
  const whSignature = createHmac("sha256", dbWebhook.secret!).update(JSON.stringify(req.body)).digest("hex");
  if (req.headers["x-hook-signature"] !== whSignature) throw new BadRequestError("invalid webhook signature");
  console.info(req.body.events);
  res.status(HttpStatus.OK).end();
});
