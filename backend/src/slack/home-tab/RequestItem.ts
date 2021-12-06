import { Blocks, Elements, Md } from "slack-block-builder";

import { REQUEST_TYPE_EMOJIS } from "~backend/src/slack/utils";
import { backendGetTopicUrl } from "~backend/src/topics/url";
import { MENTION_TYPE_LABELS, RequestType } from "~shared/types/mention";

import { createSlackLink, mdDate } from "../md/utils";
import { MessageWithOpenTask, TopicWithOpenTask } from "./types";
import { getMostUrgentMessage } from "./utils";

const TaskLabel = (userId: string, { task: tasks }: MessageWithOpenTask) => {
  const task = tasks.find((t) => t.user_id == userId);
  if (!task) {
    return "";
  }
  const type = task.type as RequestType;
  return Md.codeInline(REQUEST_TYPE_EMOJIS[type] + " " + MENTION_TYPE_LABELS[type] + " requested");
};

const TaskInfoBlock = ({ user, task: tasks, message_task_due_date: dueDate }: MessageWithOpenTask) =>
  Blocks.Context().elements(
    user.avatar_url ? Elements.Img({ imageUrl: user.avatar_url ?? undefined, altText: user.name }) : undefined,
    `${Md.bold(user.name)} to ${Md.bold("You")}${
      tasks.length == 1 ? "" : ` and ${Md.bold(String(tasks.length - 1) + " others")}`
    }`,
    dueDate ? `🗓 Due ${Md.bold(mdDate(dueDate?.due_at))}` : ""
  );

const Spacer = Blocks.Section({ text: " " });

export async function RequestItem(userId: string, topic: TopicWithOpenTask, unreadMessages: number) {
  const mostUrgentMessage = getMostUrgentMessage(topic);
  const unreadText = unreadMessages ? ` *(${unreadMessages} unread)* ` : "";

  return [
    Blocks.Section({
      text:
        createSlackLink(await backendGetTopicUrl(topic), topic.name) +
        unreadText +
        (mostUrgentMessage ? "\n" + TaskLabel(userId, mostUrgentMessage) : ""),
    }).accessory(
      Elements.Button({
        actionId: "open_view_request_modal",
        value: topic.id,
        text: "View Request",
      })
    ),
    ...(mostUrgentMessage ? [Spacer, TaskInfoBlock(mostUrgentMessage)] : []),
  ];
}
