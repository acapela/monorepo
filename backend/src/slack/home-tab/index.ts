import { App } from "@slack/bolt";
import { View } from "@slack/types";
import { HomeTab } from "slack-block-builder";

import { assertDefined } from "~shared/assert";

import { slackClient } from "../app";
import { buildSummaryBlocksForSlackUser, missingAuthSlackBlocks } from "./content";

export async function updateHomeView(botToken: string, slackUserId: string) {
  const publishView = (view: View) => slackClient.views.publish({ token: botToken, user_id: slackUserId, view });

  const homeTabBlocks = await buildSummaryBlocksForSlackUser(slackUserId, { includeWelcome: true });

  if (!homeTabBlocks) {
    await publishView(
      HomeTab()
        .blocks(...missingAuthSlackBlocks)
        .buildToObject()
    );
    return;
  }

  await publishView(
    HomeTab()
      .blocks(...homeTabBlocks)
      .buildToObject()
  );
}

export function setupHomeTab(app: App) {
  app.event("app_home_opened", async ({ event, context }) => {
    await updateHomeView(assertDefined(context.botToken, "must have bot token"), event.user);
  });
}
