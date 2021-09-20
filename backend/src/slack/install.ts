import { ActionHandler } from "~backend/src/actions/actionHandlers";
import { UnprocessableEntityError } from "~backend/src/errors/errorTypes";
import { getDevPublicTunnel } from "~backend/src/localtunnel";
import { findSlackUserId } from "~backend/src/slack/utils";
import { db } from "~db";
import {
  FindSlackUserInput,
  FindSlackUserOutput,
  GetTeamSlackInstallationUrlInput,
  GetTeamSlackInstallationUrlOutput,
} from "~gql";
import { assert } from "~shared/assert";
import { isDev } from "~shared/dev";

import { slackReceiver } from "./app";
import { Metadata } from "./metadata";

const botScopes = [
  "channels:read",
  "commands",
  "users.profile:read",
  "users:read",
  "users:read.email",
  "im:write",
  "chat:write",
];

const userScopes = ["channels:read", "groups:read", "im:read", "mpim:read", "chat:write"];

export const getSlackInstallURL = async ({ withBot }: { withBot: boolean }, metadata: Metadata) => {
  const basePath = isDev() ? (await getDevPublicTunnel(3000)).url + "/api/backend" : process.env.BACKEND_API_ENDPOINT;
  return slackReceiver.installer?.generateInstallUrl({
    userScopes,
    scopes: withBot ? botScopes : [],
    redirectUri: basePath + "/slack/oauth_redirect",
    metadata: JSON.stringify(metadata),
  });
};

export const findSlackUser: ActionHandler<{ input: FindSlackUserInput }, FindSlackUserOutput> = {
  actionName: "find_slack_user",

  async handle(userId, { input: { team_id } }) {
    const user = await db.user.findUnique({ where: { id: userId } });
    return { has_slack_user: Boolean(user && (await findSlackUserId(team_id, user))) };
  },
};

export const getTeamSlackInstallationURL: ActionHandler<
  { input: GetTeamSlackInstallationUrlInput },
  GetTeamSlackInstallationUrlOutput
> = {
  actionName: "get_team_slack_installation_url",

  async handle(userId, { input: { team_id, redirectURL } }) {
    const team = await db.team.findFirst({
      where: { id: team_id, team_member: { some: { user_id: userId } } },
      include: { team_member: true },
    });
    assert(team, new UnprocessableEntityError(`Team ${team_id} for member ${userId} not found`));
    const url = await getSlackInstallURL({ withBot: true }, { teamId: team_id, redirectURL, userId });
    assert(url, new UnprocessableEntityError("could not get Slack installation URL"));
    return { url };
  },
};
