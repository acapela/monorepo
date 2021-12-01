import assert from "assert";

import { App, BlockButtonAction, ViewOutput } from "@slack/bolt";
import { zonedTimeToUtc } from "date-fns-tz";
import { Blocks, Modal } from "slack-block-builder";

import { db } from "~db";
import { assertDefined } from "~shared/assert";
import { trackBackendUserEvent } from "~shared/backendAnalytics";
import { routes } from "~shared/routes";
import { Sentry } from "~shared/sentry";
import { Origin } from "~shared/types/analytics";
import { RequestType } from "~shared/types/mention";

import { slackClient } from "./app";
import { openCreateRequestModal } from "./create-request-modal/openCreateRequestModal";
import { updateHomeView } from "./home-tab";
import { createSlackLink, mdDate } from "./md/utils";
import { SlackActionIds, assertToken, findUserBySlackId } from "./utils";
import { ViewRequestModal } from "./view-request-modal/ViewRequestModal";

type SlackViewOrigin = Extract<
  Origin,
  "slack-live-message" | "slack-home-tab" | "slack-view-request-modal" | "unknown"
>;

function getViewOrigin(view?: ViewOutput): SlackViewOrigin {
  if (!view) {
    return "slack-live-message";
  }

  if (view.type === "home") {
    return "slack-home-tab";
  }
  if (view.type === "modal" && view.callback_id === "view_request_modal") {
    return "slack-view-request-modal";
  }

  return "unknown";
}

export function setupSlackActionHandlers(slackApp: App) {
  slackApp.action<BlockButtonAction>(SlackActionIds.CreateTopic, async ({ ack, context, body }) => {
    const { user } = await openCreateRequestModal(assertToken(context), body.trigger_id, {
      slackUserId: body.user.id,
      slackTeamId: assertDefined(body.team?.id, "must have slack team"),
      origin: "slack-home-tab",
    });

    await ack();

    if (user) {
      trackBackendUserEvent(user.id, "Used Slack Home Tab New Request", { slackUserName: body.user.name });
    }
  });

  slackApp.action<BlockButtonAction>(/open-external-url/, async ({ ack }) => {
    await ack();
  });

  slackApp.action<BlockButtonAction>(SlackActionIds.ReOpenTopic, async ({ action, say, ack, context, body }) => {
    await ack();

    const topicId = action.value;

    const user = await findUserBySlackId(assertToken(context), body.user.id);
    const topic = await db.topic.findFirst({ where: { id: topicId } });

    assert(user, `Unable to find user(slack-id=${body.user.id}`);

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

    const token = assertToken(context);
    const origin = getViewOrigin(body.view);

    if (origin === "slack-view-request-modal") {
      await slackClient.views.update({
        token,
        view_id: body.view?.id,
        view: await ViewRequestModal(token, {
          slackUserId: body.user.id,
          topicId,
        }),
      });

      // Move task back into list
      await updateHomeView(assertDefined(context.botToken, "must have bot token"), body.user.id);
    } else {
      await say(`*${topic.name}* has been reopened.`);
    }
  });

  slackApp.action<BlockButtonAction>(SlackActionIds.CloseTopic, async ({ action, say, ack, body, context }) => {
    await ack();

    const topicId = action.value;
    const user = await findUserBySlackId(assertToken(context), body.user.id);
    const topic = await db.topic.findFirst({ where: { id: topicId } });

    assert(user, `Unable to find user(slack-id=${body.user.id}`);

    if (!topic) {
      await say(`Whoops! Seems that this request doesn't exist anymore.`);
      return;
    }

    if (topic.closed_at) {
      await say(`Whoops! Seems that *${topic.name}* has been already closed.`);
      return;
    }

    const now = new Date().toISOString();
    await db.topic.update({
      where: { id: topicId },
      data: {
        closed_at: now,
        closed_by_user_id: user.id,
      },
    });

    await say(`*${topic.name}* has been closed.`);
  });

  slackApp.action<BlockButtonAction>(SlackActionIds.ArchiveTopic, async ({ action, say, ack, body, context }) => {
    await ack();

    const topicId = action.value;
    const user = await findUserBySlackId(assertToken(context), body.user.id);
    const topic = await db.topic.findFirst({ where: { id: topicId } });

    assert(user, `Unable to find user(slack-id=${body.user.id}`);

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

    const token = assertToken(context);
    const origin = getViewOrigin(body.view);

    if (origin === "slack-view-request-modal") {
      await slackClient.views.update({
        token,
        view_id: body.view?.id,
        view: await ViewRequestModal(token, {
          slackUserId: body.user.id,
          topicId,
        }),
      });

      // Excluding task from list
      await updateHomeView(assertDefined(context.botToken, "must have bot token"), body.user.id);
    } else {
      await say(`*${topic.name}* has been archived.`);
    }
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

      assert(message, `updating due date for inexistent message ${messageId}`);

      trackBackendUserEvent(message.user_id, "Added Due Date", {
        topicId: message.topic_id,
        messageId: messageId,
        origin: "slack-command",
      });

      await respond({ replace_original: true, text: `Due date was set to ${mdDate(dueAtUTC)}` });
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
    assert(task, `missing task ${taskId}`);

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
                  text: `Now if this IS your button, make sure ${createSlackLink(
                    process.env.FRONTEND_URL + routes.settings,
                    "to link your Slack account in your Acapela team settings"
                  )} so that something happens next time you press it.`,
                })
          )
          .buildToObject(),
      });
      return;
    }
    const wasTaskCompleteBeforeToggle = task.done_at;
    await db.task.update({
      where: { id: taskId },
      data: { done_at: wasTaskCompleteBeforeToggle ? null : new Date().toISOString() },
    });

    const slackOrigin = getViewOrigin(body.view);

    if (slackOrigin === "slack-view-request-modal") {
      await slackClient.views.update({
        token,
        view_id: body.view?.id,
        view: await ViewRequestModal(token, {
          slackUserId: body.user.id,
          topicId: task.message.topic_id,
        }),
      });

      // Updating homeview as task may have moved to open
      await updateHomeView(assertDefined(context.botToken, "must have bot token"), body.user.id);
    }

    if (user) {
      trackBackendUserEvent(user.id, wasTaskCompleteBeforeToggle ? "Marked Task As Not Done" : "Marked Task As Done", {
        taskType: task.type as RequestType,
        topicId: task.message.topic_id,
        origin: slackOrigin,
      });
    }
  });

  slackApp.event("app_uninstalled", async ({ body }) => {
    const slack_team_id = body.team_id;
    await db.$transaction([
      db.team_slack_installation.deleteMany({ where: { slack_team_id } }),
      db.team_member_slack.deleteMany({
        where: { team_member: { team: { team_slack_installation: { slack_team_id } } } },
      }),
    ]);
  });
}
