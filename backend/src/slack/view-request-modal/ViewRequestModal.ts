import { Blocks, Elements, Md, Modal } from "slack-block-builder";

import { assert } from "~shared/assert";
import { COMPLETED_REQUEST_LABEL, RequestType, UNCOMPLETED_REQUEST_LABEL } from "~shared/types/mention";

import { mdDate } from "../md/utils";
import { REQUEST_TYPE_EMOJIS, SlackActionIds, ViewMetadata, attachToViewWithMetadata } from "../utils";
import { getViewRequestViewModel } from "./getTopicInfo";
import { MessageInfo, TaskInfo } from "./types";

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
    Blocks.Section()
      .fields([
        Md.bold(`${tasks.length} recipients`),
        dueDate ? Md.bold("Due " + mdDate(dueDate, "date_short_pretty")) : " ",
        `@${tasks[0].user.name}`,
        Md.italic(`${tasks[0].doneAt ? COMPLETED_REQUEST_LABEL[tasks[0].type as RequestType] : "Pending"}`),
      ])
      .end(),
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

export const ViewRequestModal = async (token: string, metadata: ViewMetadata["view_request_modal"]) => {
  const topic = await getViewRequestViewModel(token, metadata.topicId, metadata.slackUserId);
  const [mainRequest, ...otherMessages] = topic.messages;

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

      ...otherMessages.flatMap((message) => [RequestOrMessageBlock(message), ...Padding(2)]),

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
