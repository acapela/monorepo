import assert from "assert";

import { App, BlockButtonAction } from "@slack/bolt";

import { db } from "~db";
import { Sentry } from "~shared/sentry";

import { SlackActionIds } from "./blocks";
import { findUserBySlackId } from "./utils";

export function setupSlackActionHandlers(slackApp: App) {
  slackApp.action<BlockButtonAction>(SlackActionIds.ReOpenTopic, async ({ action, say, ack, context, body }) => {
    const topicId = action.value;

    const user = await findUserBySlackId(context.botToken || body.token, body.user.id);
    const topic = await db.topic.findFirst({ where: { id: topicId } });

    assert(user, "Unable to find user(slack-id=${body.user.id}");

    if (!topic) {
      await ack();
      await say(`Whoops! Seems that this request doesn't exist anymore.`);
      return;
    }

    if (topic.owner_id !== user.id) {
      Sentry.captureMessage(
        "Possible invariant/security violation. " +
          `Attempting to reopoen topic(id=${topicId}) that is not owned by user (id=${user?.id}).`
      );
    }

    if (!topic?.closed_at) {
      await ack();
      await say(`Whoops! Seems that *${topic.name}* has been already reopened.`);
      return;
    }

    await db.topic.update({
      where: { id: topicId },
      data: {
        closed_at: null,
        closed_by_user_id: null,
        closing_summary: null,
        archived_at: null,
      },
    });

    await ack();
    await say(`*${topic.name}* has been reopened.`);
  });

  slackApp.action<BlockButtonAction>(SlackActionIds.ArchiveTopic, async ({ action, say, ack, body, context }) => {
    const topicId = action.value;

    const user = await findUserBySlackId(context.botToken || body.token, body.user.id);
    const topic = await db.topic.findFirst({ where: { id: topicId } });

    assert(user, "Unable to find user(slack-id=${body.user.id}");

    if (!topic) {
      await ack();
      await say(`Whoops! Seems that this request doesn't exist anymore.`);
      return;
    }

    if (topic.archived_at) {
      await ack();
      await say(`Whoops! Seems that *${topic.name}* has been already archived.`);
      return;
    }

    const shouldAlsoClose = !topic.closed_at;

    const now = new Date().toISOString();
    await db.topic.update({
      where: { id: topicId },
      data: {
        archived_at: now,
        ...(shouldAlsoClose
          ? {
              closed_at: now,
              closed_by_user_id: user.id,
            }
          : {}),
      },
    });

    await ack();
    await say(`*${topic.name}* has been archived.`);
  });
}
