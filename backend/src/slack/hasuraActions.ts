import { findSlackUserId } from "~backend/src/slack/utils";
import { db } from "~db";
import { GetTeamSlackInstallationUrlInput, GetTeamSlackInstallationUrlOutput, SlackUserOutput } from "~gql";
import { assert } from "~shared/assert";
import { Maybe } from "~shared/types";

import { ActionHandler } from "../actions/actionHandlers";
import { UnprocessableEntityError } from "../errors/errorTypes";
import { getSlackInstallURL } from "./install";

export const getTeamSlackInstallationURL: ActionHandler<
  { input: GetTeamSlackInstallationUrlInput },
  GetTeamSlackInstallationUrlOutput
> = {
  actionName: "get_team_slack_installation_url",

  async handle(userId, { input: { team_id, redirectURL } }) {
    assert(userId, "userId is required");
    const team = await db.team.findFirst({
      where: { id: team_id, team_member: { some: { user_id: userId } } },
      include: { team_member: true, team_slack_installation: true },
    });
    assert(team, new UnprocessableEntityError(`Team ${team_id} for member ${userId} not found`));
    const url = await getSlackInstallURL(
      // we need bot permissions if they were not already granted
      { withBot: !team.team_slack_installation },
      { teamId: team_id, redirectURL, userId }
    );
    assert(url, new UnprocessableEntityError("could not get Slack installation URL"));
    return { url };
  },
};

export const slackUser: ActionHandler<{ team_id: string }, SlackUserOutput> = {
  actionName: "slack_user",

  async handle(userId, { team_id }) {
    let slackUserId: Maybe<string>;
    if (userId) {
      const user = await db.user.findUnique({ where: { id: userId } });
      if (user) {
        slackUserId = await findSlackUserId(team_id, user);
      }
    }

    return { slack_user_id: slackUserId };
  },
};
