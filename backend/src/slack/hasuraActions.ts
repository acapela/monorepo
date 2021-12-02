import * as Sentry from "@sentry/node";

import { db } from "~db";
import {
  GetTeamSlackInstallationUrlInput,
  GetTeamSlackInstallationUrlOutput,
  SlackUserOutput,
  UninstallSlackOutput,
} from "~gql";
import { assert } from "~shared/assert";
import { trackBackendUserEvent } from "~shared/backendAnalytics";
import { Maybe } from "~shared/types";

import { ActionHandler } from "../actions/actionHandlers";
import { UnprocessableEntityError } from "../errors/errorTypes";
import { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, slackClient } from "./app";
import { getTeamSlackInstallURL, getUserSlackInstallURL } from "./install";
import { checkHasSlackInstallationAllBotScopes, fetchTeamBotToken, findSlackUserId } from "./utils";

export const getTeamSlackInstallationURLHandler: ActionHandler<
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

    const getSlackInstallURL = checkHasSlackInstallationAllBotScopes(team.team_slack_installation?.data)
      ? getUserSlackInstallURL
      : getTeamSlackInstallURL;
    return { url: await getSlackInstallURL({ teamId: team_id, redirectURL, userId }) };
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

export const uninstallSlack: ActionHandler<{ team_id: string }, UninstallSlackOutput> = {
  actionName: "uninstall_slack",

  async handle(userId, { team_id }) {
    const [team, botToken] = await Promise.all([
      db.team.findUnique({ where: { id: team_id } }),
      fetchTeamBotToken(team_id),
    ]);
    if (!team || team.owner_id !== userId) {
      return { success: false };
    }
    const response = await slackClient.apps.uninstall({
      token: botToken,
      client_id: SLACK_CLIENT_ID,
      client_secret: SLACK_CLIENT_SECRET,
    });

    if (!response.ok || response.error) {
      Sentry.captureException(new Error(`Slack uninstall failed: ${response.error ?? "without error information"}`));
      return { success: false };
    }

    trackBackendUserEvent(userId, "Removed Team Slack Integration", { teamId: team_id });

    return { success: true };
  },
};
