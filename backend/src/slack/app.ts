import { ServerResponse } from "http";

import * as Sentry from "@sentry/node";
import * as SlackBolt from "@slack/bolt";
import _, { noop } from "lodash";

import { UnprocessableEntityError } from "~backend/src/errors/errorTypes";
import { db } from "~db";
import { assertDefined } from "~shared/assert";
import { identifyBackendUser, identifyBackendUserTeam, trackBackendUserEvent } from "~shared/backendAnalytics";
import { IS_DEV } from "~shared/dev";
import { logger } from "~shared/logger";
import { routes } from "~shared/routes";
import { SLACK_INSTALL_ERROR_KEY, SLACK_WORKSPACE_ALREADY_USED_ERROR } from "~shared/slack";

import { HttpStatus } from "../http";
import { parseMetadata } from "./installMetadata";
import { createTeamMemberUserFromSlack } from "./utils";

type Options<T extends { new (...p: never[]): unknown }> = ConstructorParameters<T>[0];

export type SlackInstallation = SlackBolt.Installation;

export const { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET } = process.env;

function handleInstallationResponse(res: ServerResponse, redirectURL?: string, searchParams?: Record<string, string>) {
  if (redirectURL) {
    const redirectURLObject = new URL(redirectURL);
    for (const [key, value] of Object.entries(searchParams || {})) {
      redirectURLObject.searchParams.set(key, value);
    }
    res.writeHead(HttpStatus.FOUND, { Location: redirectURLObject.toString() }).end();
  } else {
    res.writeHead(HttpStatus.OK).write("<script>window.close();</script>");
    res.end();
  }
}

const sharedOptions: Options<typeof SlackBolt.ExpressReceiver> & Options<typeof SlackBolt.App> = {
  signingSecret: assertDefined(process.env.SLACK_SIGNING_SECRET, "missing SLACK_SIGNING_SECRET"),
  clientId: SLACK_CLIENT_ID,
  clientSecret: SLACK_CLIENT_SECRET,
  stateSecret: assertDefined(process.env.SLACK_STATE_SECRET, "missing SLACK_STATE_SECRET"),

  logger: {
    debug: (...msgs) => {
      logger.debug(msgs);
    },
    info: (...msgs) => {
      logger.info(msgs);
    },
    warn: (...msgs) => {
      logger.warn(msgs);
    },
    error: (...msgs) => {
      logger.error(msgs);
    },
    setLevel: noop,
    getLevel: () => SlackBolt.LogLevel.DEBUG,
    setName: noop,
  },

  installationStore: {
    async storeInstallation(installation) {
      const metadata = parseMetadata(installation);
      const { teamId } = metadata;
      let { userId } = metadata;

      const slackTeamId = assertDefined(installation.team, "installation must have team").id;
      const otherTeamWithSameSlack = await db.team.findFirst({
        where: { NOT: { id: teamId }, team_slack_installation: { slack_team_id: slackTeamId } },
      });
      if (otherTeamWithSameSlack) {
        throw new Error(SLACK_WORKSPACE_ALREADY_USED_ERROR);
      }

      const slackUser = installation.user;
      if (!userId) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        userId = (await createTeamMemberUserFromSlack(slackUser.token!, slackUser.id, teamId)).user.id;
      }

      if (installation.bot) {
        const teamData = _.omit(installation, "user", "metadata");
        const data = teamData as never;
        await db.team_slack_installation.upsert({
          where: { team_id: teamId },
          create: { team_id: teamId, data, slack_team_id: slackTeamId },
          update: { data },
        });
        trackBackendUserEvent(userId, "Added Team Slack Integration", { slackTeamId, teamId });
        identifyBackendUserTeam(userId, teamId, { isSlackInstalled: true });
      }
      const teamMember = await db.team_member.findFirst({ where: { user_id: userId, team_id: teamId } });
      if (!teamMember) {
        return;
      }
      await db.team_member_slack.upsert({
        where: { team_member_id: teamMember.id },
        create: {
          team_member_id: teamMember.id,
          installation_data: slackUser,
          slack_user_id: slackUser.id,
        },
        update: { installation_data: slackUser, slack_user_id: slackUser.id },
      });
      trackBackendUserEvent(userId, "Added User Slack Integration", { slackTeamId, teamId });
      identifyBackendUser(userId, { isSlackInstalled: true });
    },
    async fetchInstallation(query) {
      const [teamSlackInstallation, teamMemberSlackInstallation] = await Promise.all([
        db.team_slack_installation.findFirst({
          where: { slack_team_id: query.teamId },
        }),
        db.team_member_slack.findFirst({
          where: { slack_user_id: query.userId },
        }),
      ]);
      const teamData = assertDefined(
        teamSlackInstallation?.data,
        new UnprocessableEntityError(`No team Slack installation found for query ${JSON.stringify(query)}`)
      ) as unknown as SlackInstallation;
      const memberData = teamMemberSlackInstallation?.installation_data;
      return { ...teamData, user: memberData ?? {} } as SlackInstallation;
    },
  },

  installerOptions: {
    callbackOptions: {
      success(installation, options, req, res) {
        const { redirectURL } = parseMetadata(installation);
        handleInstallationResponse(res, redirectURL);
      },
      failure(error, options, req, res) {
        if (!options) {
          res.writeHead(HttpStatus.FOUND, { Location: process.env.FRONTEND_URL + routes.settings }).end();
          return;
        }
        const { redirectURL } = parseMetadata({ metadata: options.metadata });
        const isAlreadyUsedError = Boolean(error.stack?.includes(SLACK_WORKSPACE_ALREADY_USED_ERROR));
        if (!isAlreadyUsedError) {
          Sentry.captureException(error);
        }
        handleInstallationResponse(res, redirectURL, {
          // puts the error into the URL's query params for the frontend to pick it up
          [SLACK_INSTALL_ERROR_KEY]: isAlreadyUsedError ? SLACK_WORKSPACE_ALREADY_USED_ERROR : "unknown",
        });
      },
    },
  },
};

export const slackReceiver = new SlackBolt.ExpressReceiver({
  ...sharedOptions,
  endpoints: { events: "/slack/events", commands: "/slack/commands", options: "/slack/options" },
});

export const slackApp = new SlackBolt.App({
  ...sharedOptions,
  receiver: slackReceiver,
  developerMode: IS_DEV,
  socketMode: false,
});

slackApp.error(async (error) => {
  logger.error(error.original ?? error, "Error occurred during a slack flow:\n" + JSON.stringify(error, null, 2));
});

export const slackClient = slackApp.client;
