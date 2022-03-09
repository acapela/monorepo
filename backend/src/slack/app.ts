import { ServerResponse } from "http";

import * as Sentry from "@sentry/node";
import * as SlackBolt from "@slack/bolt";
import { noop } from "lodash";

import { db } from "@aca/db";
import { assertDefined } from "@aca/shared/assert";
import { IS_DEV } from "@aca/shared/dev";
import { logger } from "@aca/shared/logger";
import { routes } from "@aca/shared/routes";
import { SLACK_INSTALL_ERROR_KEY, SLACK_WORKSPACE_ALREADY_USED_ERROR } from "@aca/shared/slack";

import { HttpStatus } from "../http";
import { parseMetadata } from "./installMetadata";
import { getUserSlackInstallationFilter } from "./userSlackInstallation";

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

async function storeUserSlackInstallation(userId: string, installation: SlackInstallation) {
  const slackInstallationFilter = getUserSlackInstallationFilter({
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
      if (!userId) {
        return;
      }
      await storeUserSlackInstallation(userId, installation);
    },

    async fetchInstallation(query) {
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

      throw new Error(`Could not find a Slack installation for query ${JSON.stringify(query)}`);
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
          res.writeHead(HttpStatus.FOUND, { Location: process.env.FRONTEND_URL + routes.home }).end();
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
