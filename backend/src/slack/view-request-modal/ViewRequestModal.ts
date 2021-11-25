import { Blocks, Elements, Md, Modal } from "slack-block-builder";

import { assert } from "~shared/assert";
import { RequestType, getCompletedTaskLabel, getUncompletedTaskLabel } from "~shared/types/mention";

import { mdDate, mdTime } from "../md/utils";
import { REQUEST_TYPE_EMOJIS, ViewMetadata, attachToViewWithMetadata } from "../utils";
import { MessageInfo, TaskInfo } from "./types";

const Padding = (amountOfSpaces = 1) => [...new Array(amountOfSpaces)].map(() => Blocks.Section({ text: " " }));

function getTaskLabel(task: TaskInfo): string {
  if (task.doneAt) {
    return `↩️ Undo`;
  }
  return `${REQUEST_TYPE_EMOJIS[task.type as RequestType]} ${getUncompletedTaskLabel(task.type as RequestType)}`;
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
      url: `${topicURL}/#${message.id}`,
    }),
  ]);
}

function getTaskRecipientsLabel(tasks: TaskInfo[]) {
  assert(tasks.length > 0, "there should be at least one task");

  if (tasks.length === 1) {
    return `${Md.bold(tasks[0].user.name)}`;
  }

  const lastTask = tasks.slice(-1)[0];

  return (
    tasks
      .slice(0, -1)
      .map((t) => `${Md.bold(t.user.name)}`)
      .join(", ") + ` and ${Md.bold(lastTask.user.name)}`
  );
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
        `${Md.bold(message.fromUser.name)} to ${getTaskRecipientsLabel(tasks)}   ${mdTime(message.createdAt)}`,
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
        Md.italic(`${tasks[0].doneAt ? getCompletedTaskLabel(tasks[0].type as RequestType) : "Pending"}`),
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
        `${Md.bold(message.fromUser.name)}   ${mdTime(message.createdAt)}`,
      ])
      .end(),
    Blocks.Section({ text: message.content }).accessory(
      Elements.Button({
        text: `Reply`,
        actionId: `open-external-url-reply-button:${message.id}`,
        url: `${topicURL}/#${message.id}`,
      })
    ),
  ];
};

export const ViewRequestModal = (metadata: ViewMetadata["view_request_modal"]) => {
  const { topic } = metadata;
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
      topic.slackMessagePermalink
        ? Blocks.Section({ text: `<${topic.slackMessagePermalink}|View original Slack thread>` })
        : undefined
    )
    .buildToObject();
};
