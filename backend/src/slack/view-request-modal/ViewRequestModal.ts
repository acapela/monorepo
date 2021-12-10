import * as Sentry from "@sentry/node";
import { App, BlockDatepickerAction } from "@slack/bolt";
import { format } from "date-fns";
import { sortBy } from "lodash";
import { Blocks, EasyPaginator, Elements, Md, Modal } from "slack-block-builder";

import { updateHomeView } from "~backend/src/slack/home-tab";
import { db } from "~db";
import { assert } from "~shared/assert";
import { COMPLETED_REQUEST_LABEL, RequestType, UNCOMPLETED_REQUEST_LABEL } from "~shared/types/mention";

import { mdDate } from "../md/utils";
import {
  REQUEST_TYPE_EMOJIS,
  SlackActionIds,
  ViewMetadata,
  assertToken,
  attachToViewWithMetadata,
  buildDateTimePerUserTimezone,
  fetchTeamBotToken,
  findUserBySlackId,
} from "../utils";
import { getViewRequestViewModel } from "./getTopicInfo";
import { MessageInfo, TaskInfo, TopicInfo } from "./types";

const ActionIds = { UpdateMessageDueAt: "request-view-update-message-due-date" };

const Padding = (amountOfSpaces = 1) => [...new Array(amountOfSpaces)].map(() => Blocks.Section({ text: " " }));

function getTaskLabel(task: TaskInfo): string {
  if (task.doneAt) {
    return `↩️ Undo`;
  }
  return `${REQUEST_TYPE_EMOJIS[task.type as RequestType]} ${UNCOMPLETED_REQUEST_LABEL[task.type as RequestType]}`;
}

function MessageActionsBlocks({ tasks, message }: MessageInfo, currentSlackUserId: string, topicURL: string) {
  const taskAssignedToUser = tasks?.find((t) => t.user.slackUserId === currentSlackUserId);

  return Blocks.Actions().elements([
    taskAssignedToUser
      ? Elements.Button({
          actionId: "toggle_task_done_at:" + taskAssignedToUser.id,
          value: taskAssignedToUser.id,
          text: getTaskLabel(taskAssignedToUser),
        })
          .primary(!taskAssignedToUser.doneAt)
          .danger(!!taskAssignedToUser.doneAt)
      : undefined,
    Elements.Button({
      text: `💬 Reply to ${message.fromUser.name}`,
      actionId: `open-external-url-reply-button:${message.id}`,
      url: `${topicURL}#${message.id}`,
    }),
  ]);
}

function getTaskRecipientsLabel(tasks: TaskInfo[], slackUserId: string) {
  assert(tasks.length > 0, "there should be at least one task");

  function getIsOwnTaskIndicator(task: TaskInfo) {
    const isMeLabel = task.user.slackUserId === slackUserId ? " (you)" : "";
    return Md.bold(task.user.name + isMeLabel);
  }

  if (tasks.length === 1) {
    return getIsOwnTaskIndicator(tasks[0]);
  }

  const currentUserTaskIndex = tasks.findIndex((t) => t.user.slackUserId === slackUserId);
  const reorderedTasks =
    currentUserTaskIndex === -1
      ? [...tasks]
      : [
          tasks[currentUserTaskIndex],
          ...tasks.slice(0, currentUserTaskIndex),
          ...tasks.slice(currentUserTaskIndex + 1),
        ];

  if (tasks.length === 2) {
    return `${getIsOwnTaskIndicator(reorderedTasks[0])} and ${getIsOwnTaskIndicator(reorderedTasks[1])} `;
  }

  return `${getIsOwnTaskIndicator(reorderedTasks[0])} and ${reorderedTasks.length - 1} others`;
}

const RequestBlock = (messageInfo: MessageInfo, slackUserId: string, topicURL: string) => {
  const { message, dueDate, tasks } = messageInfo;

  assert(tasks, "tasks must always present in request");

  const taskStatusByUsers = sortBy(tasks, "doneAt").reduce<string[]>((acc, task) => {
    return acc.concat([
      `@${task.user.name}`,
      Md.italic(`${task.doneAt ? COMPLETED_REQUEST_LABEL[task.type as RequestType] : "Pending"}`),
    ]);
  }, []);

  return [
    Blocks.Context()
      .elements([
        message.fromUserImage
          ? Blocks.Image({ imageUrl: message.fromUserImage, altText: message.fromUser.name })
          : undefined,
        `${Md.bold(message.fromUser.name)} to ${getTaskRecipientsLabel(tasks, slackUserId)}   ${mdDate(
          message.createdAt,
          "time"
        )}`,
      ])
      .end(),
    Blocks.Section({ text: message.content }),
    MessageActionsBlocks(messageInfo, slackUserId, topicURL),
    Blocks.Divider(),
    Blocks.Section().fields(
      Md.bold(`${tasks.length} recipients`),
      " ",
      // Only 10 fields supported, 2 fields go into the header area
      ...(taskStatusByUsers.length > 8
        ? [...taskStatusByUsers.slice(0, 6), `...and ${Math.floor(taskStatusByUsers.length / 2 - 3)} more`]
        : taskStatusByUsers)
    ),
    Blocks.Section({ text: Md.bold("Due date") }),
    Blocks.Actions().elements(
      Elements.DatePicker()
        .actionId(ActionIds.UpdateMessageDueAt + ":date:" + message.id)
        .initialDate(dueDate),
      Elements.TimePicker()
        .actionId(ActionIds.UpdateMessageDueAt + ":time:" + message.id)
        .initialTime(dueDate ? format(dueDate, "HH:mm") : undefined)
    ),
    ...Padding(),
  ];
};

const MessageBlock = (messageInfo: MessageInfo, topicURL: string) => {
  const { message } = messageInfo;
  return [
    Blocks.Context()
      .elements([
        message.fromUserImage
          ? Blocks.Image({ imageUrl: message.fromUserImage, altText: message.fromUser.name })
          : undefined,
        `${Md.bold(message.fromUser.name)}   ${mdDate(message.createdAt, "time")}`,
      ])
      .end(),
    Blocks.Section({ text: message.content }).accessory(
      Elements.Button({
        text: `Reply`,
        actionId: `open-external-url-reply-button:${message.id}`,
        url: `${topicURL}#${message.id}`,
      })
    ),
  ];
};

async function markAsSeenAndUpdateHomeView(token: string, slackUserId: string, topic: TopicInfo) {
  try {
    const user = await findUserBySlackId(token, slackUserId, topic.teamId);
    const [{ message: lastMessage }] = topic.messages.slice(-1);

    if (user && lastMessage) {
      await db.$transaction([
        db.last_seen_message.upsert({
          where: { user_id_topic_id: { user_id: user.id, topic_id: topic.id } },
          create: { user_id: user.id, topic_id: topic.id, message_id: lastMessage.id },
          update: { message_id: lastMessage.id },
        }),
        db.task.updateMany({
          where: { message: { topic_id: topic.id }, user_id: user.id },
          data: { seen_at: new Date().toISOString() },
        }),
      ]);
      const botToken = await fetchTeamBotToken(topic.teamId);
      if (botToken) {
        await updateHomeView(botToken, slackUserId);
      }
    }
  } catch (error) {
    Sentry.captureException(error);
  }
}

export function setupViewRequestModalActions(app: App) {
  const updateMessageDueAtId = new RegExp(ActionIds.UpdateMessageDueAt + ":(date|time):*");
  app.action<BlockDatepickerAction>(updateMessageDueAtId, async ({ ack, client, context, action, body }) => {
    await ack();

    const [, , messageId] = action.action_id.split(":");
    const oldMessageTaskDueAt = await db.message_task_due_date.findUnique({ where: { message_id: messageId } });

    const oldDueAt = oldMessageTaskDueAt?.due_at;
    const dueAt = await buildDateTimePerUserTimezone(
      client as never,
      body.user.id,
      action.selected_date ?? oldDueAt?.toISOString().split("T")[0],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (action as any).selected_time ?? (oldDueAt ? format(oldDueAt, "HH:mm") : undefined)
    );

    const messageTaskDueDate = await db.message_task_due_date.upsert({
      where: { message_id: messageId },
      create: { message_id: messageId, due_at: dueAt },
      update: { due_at: dueAt },
      include: { message: true },
    });

    const token = assertToken(context);
    await client.views.update({
      token,
      view_id: body.view?.id,
      view: await ViewRequestModal(token, {
        slackUserId: body.user.id,
        topicId: messageTaskDueDate.message.topic_id,
      }),
    });
  });
}

export const ViewRequestModal = async (token: string, metadata: ViewMetadata["view_request_modal"], page?: number) => {
  const slackUserId = metadata.slackUserId;
  const topic = await getViewRequestViewModel(token, metadata.topicId, slackUserId);
  const [mainRequest, ...otherMessages] = topic.messages;

  // This does need to be awaited as its side effects are not needed for rendering the request modal, and it does its
  // own error handling
  markAsSeenAndUpdateHomeView(token, slackUserId, topic);

  const RequestOrMessageBlock = (message: MessageInfo) =>
    message.tasks?.length ? RequestBlock(message, topic.slackUserId, topic.url) : MessageBlock(message, topic.url);

  return Modal({
    title: "View Request",
    close: "Dismiss",
    ...attachToViewWithMetadata("view_request_modal", metadata),
  })
    .blocks(
      Blocks.Header({ text: topic.name }),

      ...Padding(1),

      // Main Request may have no tasks if only observers are mentioned
      RequestOrMessageBlock(mainRequest),

      ...(otherMessages.length > 0
        ? [Blocks.Divider(), Blocks.Section({ text: Md.bold("Replies") }), ...Padding()]
        : []),

      EasyPaginator({
        perPage: 5,
        items: otherMessages,
        page: page ?? 1,
        actionId: ({ page }) => `${SlackActionIds.OpenViewRequestModal}:${JSON.stringify({ page, topicId: topic.id })}`,
        blocksForEach: ({ item }) => [...RequestOrMessageBlock(item), ...Padding(2)],
      }).getBlocks(),

      Blocks.Divider(),

      Blocks.Section({
        text: topic.slackMessagePermalink ? `<${topic.slackMessagePermalink}|View original Slack thread>` : " ",
      }).accessory(
        topic.isClosed
          ? Elements.Button({ text: "Re-Open" }).value(topic.id).actionId(SlackActionIds.ReOpenTopic).primary(true)
          : Elements.Button({ text: "Close & Archive" })
              .value(topic.id)
              .actionId(SlackActionIds.ArchiveTopic)
              .danger(true)
      )
    )
    .buildToObject();
};
