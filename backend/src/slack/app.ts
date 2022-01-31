import { ServerResponse } from "http";

import * as Sentry from "@sentry/node";
import * as SlackBolt from "@slack/bolt";
import _, { noop } from "lodash";

import { UnprocessableEntityError } from "@aca/backend/src/errors/errorTypes";
import { db } from "@aca/db";
import { assert, assertDefined } from "@aca/shared/assert";
import { identifyBackendUser, identifyBackendUserTeam, trackBackendUserEvent } from "@aca/shared/backendAnalytics";
import { IS_DEV } from "@aca/shared/dev";
import { logger } from "@aca/shared/logger";
import { routes } from "@aca/shared/routes";
import { SLACK_INSTALL_ERROR_KEY, SLACK_WORKSPACE_ALREADY_USED_ERROR } from "@aca/shared/slack";

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

const getSlackInstallationFilter = ({ teamId, userId }: Partial<{ teamId: string; userId: string }>) => ({
  AND: [
    teamId ? { data: { path: ["team", "id"], equals: teamId } } : {},
    userId ? { data: { path: ["user", "id"], equals: userId } } : {},
  ],
});

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

      // For the new desktop Acapela we want to capture slack notifications for individual users, thus skipping the team
      if (!teamId) {
        assert(userId, "must have a userId when no teamId is given");

        const slackInstallationFilter = getSlackInstallationFilter({
          teamId: installation.team?.id,
          userId: installation.user.id,
        });
        const userSlackInstallation = await db.user_slack_installation.findFirst({
          where: slackInstallationFilter,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = installation as any;
        if (userSlackInstallation) {
          const installationUserId = userSlackInstallation.user_id;
          if (installationUserId != userId) {
            throw new Error(
              `Slack installation for user (${userId}) is already used by different user (${installationUserId})`
            );
          }
          await db.user_slack_installation.updateMany({
            where: { user_id: userId, ...slackInstallationFilter },
            data: { data },
          });
        } else {
          await db.$transaction([
            db.user_slack_installation.create({ data: { user_id: userId, data } }),
            db.user.update({
              where: { id: userId },
              data: {
                // user.has_slack_installation will change, but since it is computed we need to bump updated_at to
                // make it sync with clientdb
                updated_at: null, // (null sets it to `now()`)
              },
            }),
          ]);
        }

        return;
      }

      // Below is the flow for the old Acapela which splits up installation data between team and a team_member
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
      // Just like in storeInstallation we first try the new Acapela persistence
      const userSlackInstallation = await db.user_slack_installation.findFirst({
        where: getSlackInstallationFilter(query),
      });
      if (userSlackInstallation) {
        return userSlackInstallation.data as unknown as SlackInstallation;
      }

      // Below is the old Acapela team persistence flow
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
