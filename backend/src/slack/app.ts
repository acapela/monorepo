import { ServerResponse } from "http";

import * as SlackBolt from "@slack/bolt";
import { noop } from "lodash";

import { db } from "@aca/db";
import { assert, assertDefined } from "@aca/shared/assert";
import { IS_DEV } from "@aca/shared/dev";
import { logger } from "@aca/shared/logger";
import { routes } from "@aca/shared/routes";
import {
  SLACK_INSTALL_ERROR_KEY,
  SLACK_WORKSPACE_ALREADY_USED_ERROR,
  USER_ALL_CHANNELS_INCLUDED_PLACEHOLDER,
} from "@aca/shared/slack";

import { HttpStatus } from "../http";
import { parseMetadata } from "./installMetadata";

type Options<T extends { new (...p: never[]): unknown }> = ConstructorParameters<T>[0];

export type SlackInstallation = SlackBolt.Installation;

export const { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET } = process.env;

class NoInstallationFoundError extends Error {}

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

async function storeUserSlackInstallation(userId: string, installation: SlackInstallation) {
  const where = {
    slack_team_id: installation.team?.id,
    slack_user_id: installation.user.id,
  };
  const userSlackInstallation = await db.user_slack_installation.findFirst({ where });

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
      where: { user_id: userId, ...where },
      data: { data },
    });
  } else {
    const slack_workspace_id = data?.["team"]?.["id"];
    assert(slack_workspace_id, "Unable to extract team id from slack installation data");

    await db.$transaction([
      db.user_slack_installation.create({
        data: {
          user_id: userId,
          slack_team_id: installation.team!.id,
          slack_user_id: installation.user.id,
          data,
          user_slack_channels_by_team: {
            create: {
              user_id: userId,
              included_channels: [USER_ALL_CHANNELS_INCLUDED_PLACEHOLDER],
              slack_workspace_id,
            },
          },
        },
      }),
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
      const { userId } = parseMetadata(installation);
      if (userId) {
        await storeUserSlackInstallation(userId, installation);
      }
    },

    async fetchInstallation(query) {
      const getUserSlackInstallationFilter = ({ teamId, userId }: Partial<{ teamId: string; userId: string }>) => ({
        AND: [teamId ? { slack_team_id: teamId } : {}, userId ? { slack_user_id: userId } : {}],
      });
      let userSlackInstallation = await db.user_slack_installation.findFirst({
        where: getUserSlackInstallationFilter(query),
      });
      // We fall back to finding an installation for the same team, which we need to do for
      // message events, where Bolt tries to find the installation for the sending user, who
      // might not be on Acapela
      userSlackInstallation ??= await db.user_slack_installation.findFirst({
        where: getUserSlackInstallationFilter({ teamId: query.teamId }),
      });
      if (userSlackInstallation) {
        return userSlackInstallation.data as unknown as SlackInstallation;
      }

      throw new NoInstallationFoundError(`No Slack installation for query ${JSON.stringify(query)}`);
    },
  },

  installerOptions: {
    legacyStateVerification: true,
    callbackOptions: {
      success(installation, options, req, res) {
        const { redirectURL } = parseMetadata(installation);
        handleInstallationResponse(res, redirectURL);
      },
      failure(error, options, req, res) {
        if (!options) {
          res.writeHead(HttpStatus.FOUND, { Location: process.env.FRONTEND_URL + routes.home }).end();
          return;
        }
        const { redirectURL } = parseMetadata({ metadata: options.metadata });
        const isAlreadyUsedError = Boolean(error.stack?.includes(SLACK_WORKSPACE_ALREADY_USED_ERROR));
        if (!isAlreadyUsedError) {
          logger.error(error, "Error during slack installation");
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
  unhandledRequestHandler() {
    // We don't want this to show up as an error, as we have old installations on prod for which it keeps showing up
    logger.warn(
      "An incoming event was not acknowledged within 3 seconds. " +
        "\n" +
        "Ensure that the ack() argument is called in a listener."
    );
  },
});

export const slackApp = new SlackBolt.App({
  ...sharedOptions,
  receiver: slackReceiver,
  developerMode: IS_DEV,
  socketMode: false,
});

slackApp.error(async (error) => {
  if (error.message.includes("No Slack installation")) {
    logger.warn(error, "Missing slack installation");
  } else {
    logger.error(error.original ?? error, "Error occurred during a slack flow");
  }
});

export const slackClient = slackApp.client;
