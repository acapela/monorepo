import axios from "axios";
import { Request, Response, Router } from "express";
import { map, pick } from "lodash";
import qs from "qs";

import { BadRequestError } from "@aca/backend/src/errors/errorTypes";
import { HttpStatus } from "@aca/backend/src/http";
import { getUserIdFromRequest } from "@aca/backend/src/utils";
import { ClickUpAccount, ClickUpTeam, db } from "@aca/db";
import { logger } from "@aca/shared/logger";

import { getSignedState } from "../utils";

const API_ENDPOINT = "https://app.clickup.com/api/v2";

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
): Promise<ClickUpTeam[]> {
  const existingTeams = await db.clickup_team.findMany({
    where: {
      clickup_team_id: { in: map(teams, "id") },
    },
  });
  const teamsToUpdate = teams.map((t) => existingTeams.find((team) => team.clickup_team_id === t.id)!).filter(Boolean);
  const teamsToCreate = teams.filter((t) => !existingTeams.find((team) => team.clickup_team_id === t.id));
  return Promise.all([
    ...teamsToUpdate.map((t) => db.clickup_team.update({ where: { id: t.id }, data: t })),
    ...teamsToCreate.map((t) => db.clickup_team.create({ data: { clickup_team_id: t.id, name: t.name } })),
  ]);
}

// oauth callback endpoint
router.get("/v1/clickup/callback", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const { code, state } = req.query;
  if (!code) throw new BadRequestError("code is missing");
  if (!state) throw new BadRequestError("state is missing");
  if (getSignedState(userId, process.env.ASANA_OAUTH_SECRET) !== state) throw new BadRequestError("invalid state");

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
    throw new BadRequestError("oauth error");
  }

  const headers = { Authorization: accessToken };

  const [teamsRes, userRes] = await Promise.all([
    axios.get(`${API_ENDPOINT}/team`, { headers }),
    axios.get(`${API_ENDPOINT}/user`, { headers }),
  ]);

  const [clickupAccount, teams] = await Promise.all([
    createOrUpdateAccount({
      clickup_user_id: `${userRes.data.user.id}`,
      user_id: userId,
      access_token: accessToken,
    }),
    createOrUpdateTeams(teamsRes.data.teams),
  ]);

  await Promise.all(
    teams
      .map((t) => ({ team_id: t.id, account_id: clickupAccount.id }))
      .map((t) =>
        db.clickup_account_to_team.upsert({
          where: {
            account_id_team_id: t,
          },
          create: t,
          update: t,
        })
      )
  );

  // TODO: setup webhooks
  res.status(HttpStatus.OK).end();
});
