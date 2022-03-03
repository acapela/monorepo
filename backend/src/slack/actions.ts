import assert from "assert";

import Sentry from "@sentry/node";
import { App, BlockButtonAction } from "@slack/bolt";
import { Blocks, Modal } from "slack-block-builder";

import { db } from "@aca/db";
import { assertDefined } from "@aca/shared/assert";
import { routes } from "@aca/shared/routes";

import { slackClient } from "./app";
import { createLiveMessage } from "./create-request-modal/createRequestInSlack";
import { openCreateRequestModal } from "./create-request-modal/openCreateRequestModal";
import { updateHomeView } from "./home-tab";
import { createSlackLink } from "./md/utils";
import { SlackActionIds, assertToken, findUserBySlackId, getViewOrigin } from "./utils";
import { ViewRequestModal } from "./view-request-modal/ViewRequestModal";

export function setupSlackActionHandlers(slackApp: App) {
  slackApp.action<BlockButtonAction>(SlackActionIds.CreateTopic, async ({ ack, context, body }) => {
    await openCreateRequestModal(assertToken(context), body.trigger_id, {
      slackUserId: body.user.id,
      slackTeamId: assertDefined(body.team?.id, "must have slack team"),
      origin: "slack-home-tab",
    });

    await ack();
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

    const isFromViewRequestModal = origin === "slack-view-request-modal";
    if (isFromViewRequestModal || origin === "slack-home-tab") {
      if (isFromViewRequestModal) {
        await slackClient.views.update({
          token,
          view_id: body.view?.id,
          view: await ViewRequestModal(token, {
            slackUserId: body.user.id,
            topicId,
          }),
        });
      }

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

    if (getViewOrigin(body.view) == "slack-home-tab") {
      await updateHomeView(assertDefined(context.botToken, "must have bot token"), body.user.id);
    } else {
      await say(`*${topic.name}* has been closed.`);
    }
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

    const isFromViewRequestModal = origin === "slack-view-request-modal";
    if (origin == "slack-home-tab" || isFromViewRequestModal) {
      if (isFromViewRequestModal) {
        await slackClient.views.update({
          token,
          view_id: body.view?.id,
          view: await ViewRequestModal(token, {
            slackUserId: body.user.id,
            topicId,
          }),
        });
      }

      // Excluding task from list
      await updateHomeView(assertDefined(context.botToken, "must have bot token"), body.user.id);
    } else {
      await say(`*${topic.name}* has been archived.`);
    }
  });

  slackApp.action("members_select", async ({ ack }) => {
    await ack();
  });

  slackApp.action<BlockButtonAction>(SlackActionIds.TrackEvent, async ({ ack }) => {
    await ack();
  });

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
    const doneAt = wasTaskCompleteBeforeToggle ? null : new Date().toISOString();
    await db.task.update({ where: { id: taskId }, data: { done_at: doneAt } });

    if (task.message.is_first_completion_enough && doneAt) {
      await db.topic.update({
        where: { id: task.message.topic_id },
        data: { closed_at: doneAt, closed_by_user_id: user.id },
      });
    }

    const slackOrigin = getViewOrigin(body.view);

    const isFromViewRequestModal = slackOrigin === "slack-view-request-modal";

    if (isFromViewRequestModal) {
      await slackClient.views.update({
        token,
        view_id: body.view?.id,
        view: await ViewRequestModal(token, {
          slackUserId: body.user.id,
          topicId: task.message.topic_id,
        }),
      });
    }

    if (isFromViewRequestModal || slackOrigin == "slack-home-tab") {
      // Updating homeview as task may have moved to open
      await updateHomeView(assertDefined(context.botToken, "must have bot token"), body.user.id);
    }
  });

  slackApp.event("app_uninstalled", async ({ body, context }) => {
    const slack_team_id = body.team_id;
    if (context.userToken) {
      await db.user_slack_installation.deleteMany({
        where: { data: { path: ["user", "token"], equals: context.userToken } },
      });
    }
    await db.$transaction([
      db.team_slack_installation.deleteMany({ where: { slack_team_id } }),
      db.team_member_slack.deleteMany({
        where: { team_member: { team: { team_slack_installation: { slack_team_id } } } },
      }),
    ]);
  });

  slackApp.action<BlockButtonAction>(
    SlackActionIds.PostSelfRequestInChannel,
    async ({ action, respond, ack, context, client }) => {
      await ack();
      // delete ephemeral message
      await respond({ replace_original: true, delete_original: true, text: "" });

      const [topicId, hasRequestOriginatedFromMessageActionStr, conversationId, messageTs] = action.value.split("/");
      const topic = await db.topic.findFirst({
        where: { id: topicId },
        include: { message: true, topic_access_token: true, user: true, topic_member: true },
      });
      await createLiveMessage({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore WebClient has different version of typings and is not directly exported from slack-bolt
        client,
        topic: assertDefined(topic, "must have topic"),
        hasRequestOriginatedFromMessageAction: hasRequestOriginatedFromMessageActionStr === "true",
        conversationId,
        token: assertToken(context),
        messageTs: messageTs || undefined,
      });
    }
  );
}
