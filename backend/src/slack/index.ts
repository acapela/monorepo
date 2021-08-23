import * as crypto from "crypto";

import * as SlackBolt from "@slack/bolt";
import type { Express } from "express";

import { ActionHandler } from "~backend/src/actions/actionHandlers";
import { UnprocessableEntityError } from "~backend/src/errors/errorTypes";
import { getDevPublicTunnel } from "~backend/src/localtunnel";
import { db } from "~db";
import { GetTeamSlackInstallationUrlInput, GetTeamSlackInstallationUrlOutput } from "~gql";
import { assert, assertDefined } from "~shared/assert";
import { isDev } from "~shared/dev";

import { setupSlackCommands } from "./commands";
import { setupSlackEvents } from "./events";
import { setupSlackOptions } from "./options";

const botScopes = [
  "channels:read",
  "commands",
  "users.profile:read",
  "users:read",
  "users:read.email",
  "im:write",
  "chat:write",
];

const userScopes = ["groups:read", "im:read", "mpim:read"];

type Options<T extends { new (...p: never[]): unknown }> = ConstructorParameters<T>[0];

type Metadata = { teamId: string; redirectURL: string; userId: string };

function parseMetadata({ metadata }: SlackBolt.Installation): Metadata {
  if (!metadata) {
    throw new Error("Missing metadata");
  }
  return JSON.parse(metadata);
}

const sharedOptions: Options<typeof SlackBolt.ExpressReceiver> & Options<typeof SlackBolt.App> = {
  signingSecret: assertDefined(process.env.SLACK_SIGNING_SECRET, "missing SLACK_SIGNING_SECRET"),
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: crypto.randomBytes(64).toString("hex"),
  installationStore: {
    async storeInstallation(installation) {
      const { teamId, userId } = parseMetadata(installation);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const slackTeamId = installation.team!.id;
      const slackUserId = installation.user.id;
      // do we want to use upsert here to avoid the call failing?
      await db.team_slack_installation.create({
        data: { team_id: teamId, data: installation as never, slack_team_id: slackTeamId },
      });
      const teamMember = await db.team_member.findFirst({ where: { user_id: userId, team_id: teamId } });
      if (teamMember) {
        await db.team_member_slack_installation.create({
          data: {
            team_member_id: teamMember.id,
            data: installation as never,
            slack_team_id: slackTeamId,
            slack_user_id: slackUserId,
          },
        });
      }
    },
    async fetchInstallation(query) {
      const individualSlackInstallation = await db.team_member_slack_installation.findFirst({
        where: { slack_user_id: query.userId },
      });
      if (individualSlackInstallation) {
        assert(
          individualSlackInstallation.data,
          new UnprocessableEntityError(`No user Slack installation found for query ${JSON.stringify(query)}`)
        );
        return individualSlackInstallation.data as unknown as SlackBolt.Installation;
      } else {
        const slackInstallation = await db.team_slack_installation.findFirst({
          where: { slack_team_id: query.teamId },
        });
        assert(
          slackInstallation?.data,
          new UnprocessableEntityError(`No team Slack installation found for query ${JSON.stringify(query)}`)
        );
        return slackInstallation.data as unknown as SlackBolt.Installation;
      }
    },
    async deleteInstallation(query) {
      const SlackUserId = query.userId;
      if (SlackUserId) {
        await db.team_member_slack_installation.deleteMany({ where: { slack_user_id: query.userId } });
        const remainingTeamInstallations = await db.team_member_slack_installation.count({
          where: { slack_team_id: query.teamId },
        });
        if (remainingTeamInstallations === 0) {
          await db.team_slack_installation.deleteMany({ where: { slack_team_id: query.teamId } });
        }
      }
    },
  },

  installerOptions: {
    callbackOptions: {
      success(installation, options, req, res) {
        const { redirectURL } = parseMetadata(installation);
        res.writeHead(302, { Location: redirectURL || "/" }).end();
      },
    },
  },
};

const slackReceiver = new SlackBolt.ExpressReceiver({
  ...sharedOptions,
  endpoints: { events: "/slack/events", commands: "/slack/commands", options: "/slack/options" },
});

const getSlackInstallURL = async (state?: unknown) => {
  const basePath = isDev() ? (await getDevPublicTunnel(3000)).url + "/api/backend" : process.env.BACKEND_API_ENDPOINT;
  return slackReceiver.installer?.generateInstallUrl({
    userScopes,
    scopes: botScopes,
    redirectUri: basePath + "/slack/oauth_redirect",
    metadata: JSON.stringify(state),
  });
};

export const slackApp = new SlackBolt.App({
  ...sharedOptions,
  receiver: slackReceiver,
  developerMode: isDev(),
});

export const slackClient = slackApp.client;

export const getTeamSlackInstallationURL: ActionHandler<
  { input: GetTeamSlackInstallationUrlInput },
  GetTeamSlackInstallationUrlOutput
> = {
  actionName: "get_team_slack_installation_url",

  async handle(userId, { input: { teamId, redirectURL } }) {
    const team = await db.team.findFirst({
      where: { id: teamId, team_member: { some: { user_id: userId } } },
      include: { team_member: true },
    });
    assert(team, new UnprocessableEntityError(`Team ${teamId} for member ${userId} not found`));
    const url = await getSlackInstallURL({ teamId, redirectURL, userId });
    assert(url, new UnprocessableEntityError("could not get Slack installation URL"));
    return { url };
  },
};

setupSlackEvents(slackApp);
setupSlackCommands(slackApp);
setupSlackOptions(slackApp);

export function setupSlackBoltRoutes(app: Express) {
  app.use("/api", slackReceiver.router);
}
