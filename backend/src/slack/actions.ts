import assert from "assert";

import { App, BlockButtonAction } from "@slack/bolt";
import { zonedTimeToUtc } from "date-fns-tz";
import { Blocks, Modal } from "slack-block-builder";

import { createSlackLink } from "~backend/src/notifications/sendNotification";
import { updateHomeView } from "~backend/src/slack/home-tab";
import { db } from "~db";
import { assertDefined } from "~shared/assert";
import { trackBackendUserEvent } from "~shared/backendAnalytics";
import { Sentry } from "~shared/sentry";
import { RequestType } from "~shared/types/mention";

import { slackClient } from "./app";
import { getSlackInstallURL } from "./install";
import { tryOpenRequestModal } from "./request-modal/tryOpenRequestModal";
import { SlackActionIds, assertToken, findUserBySlackId } from "./utils";

export function setupSlackActionHandlers(slackApp: App) {
  slackApp.action<BlockButtonAction>(SlackActionIds.CreateTopic, async ({ ack, context, body }) => {
    const { user } = await tryOpenRequestModal(assertToken(context), body.trigger_id, {
      slackUserId: body.user.id,
      slackTeamId: assertDefined(body.team?.id, "must have slack team"),
      origin: "slack-home-tab",
    });

    await ack();

    if (user) {
      trackBackendUserEvent(user.id, "Used Slack Home Tab New Request", { slackUserName: body.user.name });
    }
  });

  slackApp.action<BlockButtonAction>(SlackActionIds.ReOpenTopic, async ({ action, say, ack, context, body }) => {
    const topicId = action.value;

    const user = await findUserBySlackId(assertToken(context), body.user.id);
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
    await ack();

    const topicId = action.value;
    const user = await findUserBySlackId(assertToken(context), body.user.id);
    const topic = await db.topic.findFirst({ where: { id: topicId } });

    assert(user, "Unable to find user(slack-id=${body.user.id}");

    if (!topic) {
      await say(`Whoops! Seems that this request doesn't exist anymore.`);
      return;
    }

    if (topic.archived_at) {
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

    await say(`*${topic.name}* has been archived.`);
  });

  slackApp.action("members_select", async ({ ack }) => {
    await ack();
  });

  slackApp.action<BlockButtonAction>(SlackActionIds.TrackEvent, async ({ ack, payload }) => {
    await ack();
    trackBackendUserEvent(...(JSON.parse(payload.value) as [never, never]));
  });

  slackApp.action<BlockButtonAction>(
    SlackActionIds.UpdateMessageTaskDueAt,
    async ({ ack, action, body, client, respond }) => {
      await ack();
      if (!body.state) {
        return;
      }
      const messageId = action.value;
      const {
        due_at_date_block: {
          due_at_date: { selected_date: dueAtDate },
        },
        due_at_hour_block: {
          due_at_hour: { selected_option: dueAtHour },
        },
      } = body.state.values;
      if (!dueAtDate || !dueAtHour?.value) {
        return;
      }

      const { user: slackUser } = await client.users.info({ user: body.user.id });
      if (!slackUser?.tz) {
        return;
      }

      const dueAtUTC = zonedTimeToUtc(`${dueAtDate} ${dueAtHour.value}:00`, slackUser.tz);

      const data = { due_at: dueAtUTC.toISOString() };
      await db.message_task_due_date.upsert({
        where: { message_id: messageId },
        create: { message_id: messageId, ...data },
        update: data,
      });

      const message = await db.message.findFirst({
        where: {
          id: messageId,
        },
      });

      assert(message, "updating due date for inexistent message");

      trackBackendUserEvent(message.user_id, "Added Due Date", {
        topicId: message.topic_id,
        messageId: messageId,
        origin: "slack-command",
      });

      const unixTime = dueAtUTC.getTime() / 1000;
      await respond({
        replace_original: true,
        text: `Due date was set to <!date^${unixTime}^{date_long_pretty} {time}|${dueAtUTC.toISOString()}>`,
      });
    }
  );

  slackApp.action<BlockButtonAction>(/toggle_task_done_at:.*/, async ({ ack, action, body, context }) => {
    await ack();

    const token = assertToken(context);
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
              text: `You pressed "${action.text.text}" but that button does not seem to belong to you. So nothing happened really.`,
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

    const isCalledFromSlackHome = body.view?.type == "home";
    if (isCalledFromSlackHome) {
      await updateHomeView(assertDefined(context.botToken, "must have bot token"), body.user.id);
    }

    if (user) {
      trackBackendUserEvent(user.id, "Marked Task As Done", {
        taskType: task.type as RequestType,
        topicId: task.message.topic_id,
        origin: isCalledFromSlackHome ? "slack-home" : "slack-live-message",
      });
    }
  });
}
