import * as crypto from "crypto";

import * as Sentry from "@sentry/node";
import * as SlackBolt from "@slack/bolt";
import _ from "lodash";

import { UnprocessableEntityError } from "~backend/src/errors/errorTypes";
import { db } from "~db";
import { assertDefined } from "~shared/assert";
import { isDev } from "~shared/dev";

import { HttpStatus } from "../http";
import { parseMetadata } from "./metadata";

type Options<T extends { new (...p: never[]): unknown }> = ConstructorParameters<T>[0];

export type SlackInstallation = SlackBolt.Installation;

const clientId = process.env.SLACK_CLIENT_ID;
const clientSecret = process.env.SLACK_CLIENT_SECRET;

const sharedOptions: Options<typeof SlackBolt.ExpressReceiver> & Options<typeof SlackBolt.App> = {
  signingSecret: assertDefined(process.env.SLACK_SIGNING_SECRET, "missing SLACK_SIGNING_SECRET"),
  clientId,
  clientSecret,
  stateSecret: crypto.randomBytes(64).toString("hex"),

  installationStore: {
    async storeInstallation(installation) {
      const { teamId, userId } = parseMetadata(installation);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const slackTeamId = installation.team!.id;
      if (installation.bot) {
        const teamData = _.omit(installation, "user", "metadata");
        await db.team_slack_installation.upsert({
          where: { team_id: teamId },
          create: { team_id: teamId, data: teamData as never, slack_team_id: slackTeamId },
          update: {},
        });
      }
      if (!userId) {
        return;
      }
      const teamMember = await db.team_member.findFirst({ where: { user_id: userId, team_id: teamId } });
      if (!teamMember) {
        return;
      }
      await db.team_member_slack_installation.create({
        data: {
          team_member_id: teamMember.id,
          data: installation.user as never,
          slack_team_id: slackTeamId,
          slack_user_id: installation.user.id,
        },
      });
    },
    async fetchInstallation(query) {
      const [teamSlackInstallation, teamMemberSlackInstallation] = await Promise.all([
        db.team_slack_installation.findFirst({
          where: { slack_team_id: query.teamId },
        }),
        db.team_member_slack_installation.findFirst({
          where: { slack_user_id: query.userId },
        }),
      ]);
      const teamData = assertDefined(
        teamSlackInstallation?.data,
        new UnprocessableEntityError(`No team Slack installation found for query ${JSON.stringify(query)}`)
      ) as unknown as SlackInstallation;
      const memberData = teamMemberSlackInstallation?.data;
      return { ...teamData, user: memberData ?? {} } as SlackInstallation;
    },
    async deleteInstallation(query) {
      await db.$transaction([
        db.team_slack_installation.deleteMany({ where: { slack_team_id: query.teamId } }),
        db.team_member_slack_installation.deleteMany({
          where: { team_slack_installation: { slack_team_id: query.teamId } },
        }),
      ]);
    },
  },

  installerOptions: {
    callbackOptions: {
      success(installation, options, req, res) {
        const { redirectURL } = parseMetadata(installation);
        res.writeHead(HttpStatus.FOUND, { Location: redirectURL || "/" }).end();
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
  developerMode: isDev(),
});

slackApp.error(async (error) => {
  Sentry.captureException(error);
});

export const slackClient = slackApp.client;
