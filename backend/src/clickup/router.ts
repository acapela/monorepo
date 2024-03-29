import { createHmac } from "crypto";

import axios from "axios";
import { Request, Response, Router } from "express";
import { map, pick } from "lodash";
import qs from "qs";
import * as uuid from "uuid";

import { BadRequestError, NotFoundError } from "@aca/backend/src/errors/errorTypes";
import { HttpStatus } from "@aca/backend/src/http";
import { listenForWebhooks } from "@aca/backend/src/webhooks";
import { ClickUpAccount, ClickUpTeam, db } from "@aca/db";
import { trackBackendUserEvent } from "@aca/shared/backendAnalytics";
import { logger } from "@aca/shared/logger";

import { getSignedState, getUserIdFromRequest, getWebhookEndpoint } from "../utils";
import { EventTypes, Webhook } from "./types";
import { API_ENDPOINT } from "./utils";
import { processEvent } from "./webhooks";

export const router = Router();

router.get("/v1/clickup/auth", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  // oauth redirect with signed state
  const queryString = qs.stringify({
    client_id: process.env.CLICKUP_CLIENT_ID,
    redirect_uri: `${process.env.FRONTEND_URL}/api/backend/v1/clickup/callback`,
    state: getSignedState(userId, process.env.CLICKUP_OAUTH_SECRET),
  });
  res.redirect(`https://app.clickup.com/api?${queryString}`);
});

async function createOrUpdateAccount(data: {
  clickup_user_id: string;
  user_id: string;
  access_token: string;
}): Promise<ClickUpAccount> {
  const clickupAccount = await db.clickup_account.findFirst({
    where: pick(data, ["clickup_user_id", "user_id"]),
  });
  if (!clickupAccount) {
    return await db.clickup_account.create({
      data,
    });
  }
  return await db.clickup_account.update({
    where: {
      id: clickupAccount.id,
    },
    data,
  });
}

async function createOrUpdateTeams(
  teams: {
    id: string;
    name: string;
  }[]
): Promise<[ClickUpTeam[], ClickUpTeam[]]> {
  const existingTeams = await db.clickup_team.findMany({
    where: {
      clickup_team_id: { in: map(teams, "id") },
    },
  });
  const teamsToUpdate = teams.map((t) => existingTeams.find((team) => team.clickup_team_id === t.id)!).filter(Boolean);
  const teamsToCreate = teams.filter((t) => !existingTeams.find((team) => team.clickup_team_id === t.id));
  return Promise.all([
    Promise.all(teamsToUpdate.map((t) => db.clickup_team.update({ where: { id: t.id }, data: t }))),
    Promise.all(teamsToCreate.map((t) => db.clickup_team.create({ data: { clickup_team_id: t.id, name: t.name } }))),
  ]);
}

// oauth callback endpoint
router.get("/v1/clickup/callback", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const { code, state } = req.query;
  if (!code) throw new BadRequestError("code is missing");
  if (!state) throw new BadRequestError("state is missing");
  if (getSignedState(userId, process.env.CLICKUP_OAUTH_SECRET) !== state) throw new BadRequestError("invalid state");

  const params = qs.stringify({
    code,
    client_id: process.env.CLICKUP_CLIENT_ID,
    client_secret: process.env.CLICKUP_CLIENT_SECRET,
  });

  let accessToken = "";
  try {
    const oauthRes = await axios.post(`${API_ENDPOINT}/oauth/token?${params}`);
    accessToken = oauthRes.data.access_token;
  } catch (e) {
    logger.error("oauth error: " + e);
    throw new BadRequestError("clickup oauth error");
  }

  const headers = { Authorization: accessToken };

  const [teamsRes, userRes] = await Promise.all([
    axios.get(`${API_ENDPOINT}/team`, { headers }),
    axios.get(`${API_ENDPOINT}/user`, { headers }),
  ]);

  const [clickupAccount, [updatedTeams, createdTeams]] = await Promise.all([
    createOrUpdateAccount({
      clickup_user_id: `${userRes.data.user.id}`,
      user_id: userId,
      access_token: accessToken,
    }),
    createOrUpdateTeams(teamsRes.data.teams),
  ]);
  const teams = [...updatedTeams, ...createdTeams];

  // re-create all linked teams for the account
  await db.$transaction([
    db.clickup_account_to_team.deleteMany({ where: { account_id: clickupAccount.id } }),
    db.clickup_account_to_team.createMany({
      data: teams.map((t) => ({ team_id: t.id, account_id: clickupAccount.id })),
    }),
  ]);

  const whEndpoint = await getWebhookEndpoint("clickup");

  // fetch webhooks for created teams
  const webhooks = await Promise.all(
    createdTeams.map((t) => axios.get(`${API_ENDPOINT}/team/${t.clickup_team_id}/webhook`, { headers }))
  );

  // cleanup old webhooks (ideally array should be empty)
  const existingWebhooks = map(webhooks, "data.webhooks")
    .flat()
    .filter((w) => w.client_id === process.env.CLICKUP_CLIENT_ID)
    .map((w) => w.id);
  await Promise.all(existingWebhooks.map((w) => axios.delete(`${API_ENDPOINT}/webhook/${w}`, { headers })));

  // create new webhooks
  await Promise.all(
    createdTeams.map(async (t) => {
      const createdWebhook = await axios.post(
        `${API_ENDPOINT}/team/${t.clickup_team_id}/webhook`,
        {
          endpoint: `${whEndpoint}/${t.id}`,
          events: ["*"],
        },
        { headers }
      );
      await db.clickup_team.update({
        where: { id: t.id },
        data: {
          webhook_id: createdWebhook.data.webhook.id,
          webhook_secret: createdWebhook.data.webhook.secret,
        },
      });
    })
  );
  res.status(HttpStatus.OK).end();
  trackBackendUserEvent(userId, "ClickUp Integration Added");
  trackBackendUserEvent(userId, "New Integration Added", { integration: "clickup" });
});

async function verifyAndProcess({
  rawBody,
  signature,
  teamId,
}: {
  rawBody: string | object;
  signature: string;
  teamId: string;
}) {
  if (!uuid.validate(teamId)) {
    logger.warn(`invalid team id: ${teamId}`);
    return;
  }

  const webhook = (typeof rawBody === "object" ? rawBody : JSON.parse(rawBody)) as Webhook;
  // ignore events that are not handled
  if (!EventTypes.includes(webhook.event)) return;

  const team = await db.clickup_team.findFirst({
    where: { id: teamId },
    include: { clickup_account_to_team: { include: { clickup_account: true } } },
  });
  if (!team) {
    logger.warn(`team not found: ${teamId}`);
    return;
  }
  if (team.webhook_id !== webhook.webhook_id) {
    logger.warn(`webhook id mismatch: ${team.webhook_id} !== ${webhook.webhook_id}`);
    return;
  }
  if (!team.clickup_account_to_team.length) {
    logger.warn(`team has no members: ${teamId}`);
    // cleanup clickup team in database
    try {
      await db.clickup_account.delete({ where: { id: team.id } });
    } catch (e) {
      // we can ignore the error
    }
    return;
  }

  // validate webhook signature
  const whSignature = createHmac("sha256", team.webhook_secret!).update(JSON.stringify(webhook)).digest("hex");
  if (signature !== whSignature) {
    logger.warn(`invalid webhook signature`);
    return;
  }

  await processEvent(webhook, team);
}

listenForWebhooks("clickup", async (rawBody, params, headers) => {
  try {
    await verifyAndProcess({
      rawBody,
      signature: headers["x-signature"],
      teamId: params.id,
    });
  } catch (e) {
    logger.error(e, "error processing clickup webhook");
  }
});

router.post("/v1/clickup/webhook/:team", async (req: Request, res: Response) => {
  // accept webhook
  res.status(HttpStatus.OK).end();

  await verifyAndProcess({
    rawBody: req.body,
    signature: req.headers["x-signature"] as string,
    teamId: req.params.team,
  });
});

router.get("/v1/clickup/unlink", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const clickupAccount = await db.clickup_account.findFirst({
    where: { user_id: userId },
    include: { clickup_account_to_team: { include: { clickup_team: true } } },
  });
  if (!clickupAccount) throw new NotFoundError("clickup account not found");

  const headers = { Authorization: clickupAccount.access_token };

  const teams = clickupAccount.clickup_account_to_team;
  const teamMemberCount = await db.clickup_account_to_team.groupBy({
    by: ["team_id"],
    where: { team_id: { in: teams.map((t) => t.team_id) } },
    _count: true,
  });

  // cleanup webhooks
  for (const tmc of teamMemberCount) {
    if (tmc._count > 1) continue;
    const team = teams.find((t) => t.team_id === tmc.team_id);
    if (!team) continue;
    await Promise.all([
      db.clickup_team.delete({ where: { id: team.team_id } }),
      axios.delete(`${API_ENDPOINT}/webhook/${team.clickup_team.webhook_id}`, { headers }),
    ]);
  }

  await db.clickup_account.deleteMany({ where: { user_id: userId } });

  res.status(HttpStatus.OK).send("ok");
});

router.get("/v1/clickup/unlink/:team", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const teamId = req.params.team;
  const clickupAccount = await db.clickup_account.findFirst({
    where: { user_id: userId },
    include: { clickup_account_to_team: { include: { clickup_team: true } } },
  });
  if (!clickupAccount) throw new NotFoundError("clickup account not found");

  const team = clickupAccount.clickup_account_to_team.find((t) => t.team_id === teamId);
  if (!team) throw new NotFoundError("clickup team not found");

  const teamMemberCount = await db.clickup_account_to_team.groupBy({
    by: ["team_id"],
    where: { team_id: teamId },
    _count: true,
  });

  const headers = { Authorization: clickupAccount.access_token };
  const teamOnlyHasOneMember = teamMemberCount.every((tmc) => tmc._count === 1);
  if (teamOnlyHasOneMember) {
    // team only has on member, we can delete the team + webhook
    await Promise.all([
      db.clickup_team.delete({ where: { id: team.team_id } }),
      axios.delete(`${API_ENDPOINT}/webhook/${team.clickup_team.webhook_id}`, { headers }),
    ]);
  } else {
    await db.clickup_account_to_team.delete({ where: { account_id_team_id: pick(team, "team_id", "account_id") } });
  }

  res.status(HttpStatus.OK).send("ok");
});
