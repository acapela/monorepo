import * as crypto from "crypto";

import * as SlackBolt from "@slack/bolt";
import type { Express } from "express";

import { ActionHandler } from "~backend/src/actions/actionHandlers";
import { UnprocessableEntityError } from "~backend/src/errors/errorTypes";
import { getDevPublicTunnel } from "~backend/src/localtunnel";
import { db } from "~db";
import { GetTeamSlackInstallationUrlInput, GetTeamSlackInstallationUrlOutput } from "~gql";
import { assert, assertDefined } from "~shared/assert";

const scopes = ["im:write"];

type Options<T extends { new (...p: never[]): unknown }> = ConstructorParameters<T>[0];

type Metadata = { teamId: string; redirectURL: string };

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

  scopes,

  installationStore: {
    async storeInstallation(installation) {
      const { teamId } = parseMetadata(installation);
      await db.team_slack_installation.create({ data: { team_id: teamId, data: installation as never } });
    },
    async fetchInstallation(query) {
      const slackInstallation = await db.team_slack_installation.findFirst({
        where: { data: { path: ["teamId"], equals: query.teamId } },
      });
      assert(
        slackInstallation?.data,
        new UnprocessableEntityError(`No Slack installation found for query ${JSON.stringify(query)}`)
      );
      return slackInstallation.data as unknown as SlackBolt.Installation;
    },
    async deleteInstallation(query) {
      await db.team_slack_installation.deleteMany({ where: { data: { path: ["teamId"], equals: query.teamId } } });
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

const isDevelopment = process.env.STAGE === "development";

const slackReceiver = new SlackBolt.ExpressReceiver({ ...sharedOptions, endpoints: "/" });
const slackApp = new SlackBolt.App({
  ...sharedOptions,
  receiver: slackReceiver,
  developerMode: isDevelopment,
});

const getSlackInstallURL = async (state?: unknown) => {
  const basePath = isDevelopment
    ? (await getDevPublicTunnel(3000)).url + "/api/backend"
    : process.env.BACKEND_API_ENDPOINT;
  return slackReceiver.installer?.generateInstallUrl({
    scopes,
    redirectUri: basePath + "/slack/oauth_redirect",
    metadata: JSON.stringify(state),
  });
};

export const slackChat = slackApp.client.chat;

export const getTeamSlackInstallationURL: ActionHandler<
  { input: GetTeamSlackInstallationUrlInput },
  GetTeamSlackInstallationUrlOutput
> = {
  actionName: "get_team_slack_installation_url",

  async handle(userId, { input: { teamId, redirectURL } }) {
    const team = await db.team.findFirst({ where: { id: teamId, owner_id: userId } });
    assert(team, new UnprocessableEntityError(`Team ${teamId} for owner ${userId} not found`));
    const url = await getSlackInstallURL({ teamId, redirectURL });
    assert(url, new UnprocessableEntityError("could not get Slack installation URL"));
    return { url };
  },
};

export function setupSlackBoltRoutes(app: Express) {
  app.use("/api", slackReceiver.router);
}
