import assert from "assert";

import { App, BlockButtonAction } from "@slack/bolt";
import { Blocks, Modal } from "slack-block-builder";

import { createSlackLink } from "~backend/src/notifications/sendNotification";
import { slackClient } from "~backend/src/slack/app";
import { getSlackInstallURL } from "~backend/src/slack/install";
import { db } from "~db";
import { Sentry } from "~shared/sentry";

import { SlackActionIds, findUserBySlackId } from "./utils";

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

  slackApp.action(/toggle_task_done_at:.*/, async ({ ack, action, body, context }) => {
    await ack();

    const token = context.userToken ?? body.token;
    const taskId = (action as { value: string }).value;
    const [user, task] = await Promise.all([
      findUserBySlackId(token, body.user.id),
      db.task.findUnique({ where: { id: taskId }, include: { message: { include: { topic: true } }, user: true } }),
    ]);
    assert(task, "missing task");
    if (user?.id !== task.user_id) {
      await slackClient.views.open({
        token,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        trigger_id: (body as any).trigger_id,
        view: Modal({ title: "Nothing happened really" })
          .blocks(
            Blocks.Section({
              text: `You pressed "${
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (action as any).text.text
              }" but that button does not seem to belong to you. So nothing happened really.`,
            }),
            user
              ? Blocks.Section({
                  text: `If you really want to press a button, we recommend the ones starting with "${user.name}".`,
                })
              : Blocks.Section({
                  text: `Now if this IS your button, make sure to ${createSlackLink(
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    (await getSlackInstallURL({ withBot: false }, { teamId: task.message.topic.team_id }))!,
                    "authorize Acapela to access your Slack"
                  )} so that something happens next time you press that button.`,
                })
          )
          .buildToObject(),
      });
      return;
    }
    await db.task.update({ where: { id: taskId }, data: { done_at: task.done_at ? null : new Date().toISOString() } });
  });
}
