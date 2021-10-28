import { ActionHandler } from "~backend/src/actions/actionHandlers";
import { UnprocessableEntityError } from "~backend/src/errors/errorTypes";
import { getDevPublicTunnel } from "~backend/src/localtunnel";
import { db } from "~db";
import { GetTeamSlackInstallationUrlInput, GetTeamSlackInstallationUrlOutput } from "~gql";
import { assert } from "~shared/assert";
import { isDev } from "~shared/dev";

import { slackReceiver } from "./app";
import manifest from "./manifest.json";
import { Metadata } from "./metadata";

export const { bot: botScopes, user: userScopes } = manifest.oauth_config.scopes;

export const getSlackInstallURL = async ({ withBot }: { withBot: boolean }, metadata: Metadata) => {
  const basePath = isDev() ? (await getDevPublicTunnel(3000)).url + "/api/backend" : process.env.BACKEND_API_ENDPOINT;
  return slackReceiver.installer?.generateInstallUrl({
    userScopes,
    scopes: withBot ? botScopes : [],
    redirectUri: basePath + "/slack/oauth_redirect",
    metadata: JSON.stringify(metadata),
  });
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
