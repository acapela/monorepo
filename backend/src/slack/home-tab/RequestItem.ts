import { Blocks, Elements, Md } from "slack-block-builder";

import { REQUEST_TYPE_EMOJIS, SlackActionIds } from "~backend/src/slack/utils";
import { backendGetTopicUrl } from "~backend/src/topics/url";
import { User } from "~db";
import { pluralize } from "~shared/text/pluralize";
import { MENTION_TYPE_LABELS, RequestType, UNCOMPLETED_REQUEST_LABEL } from "~shared/types/mention";

import { mdDate } from "../md/utils";
import { MessageWithOpenTask, TopicWithOpenTask } from "./types";
import { Padding, getMostUrgentMessage } from "./utils";

const TaskLabel = (type: RequestType) =>
  Md.codeInline(REQUEST_TYPE_EMOJIS[type] + " " + MENTION_TYPE_LABELS[type] + " requested");

const Avatar = (user: User) =>
  user.avatar_url ? Elements.Img({ imageUrl: user.avatar_url ?? undefined, altText: user.name }) : undefined;

const UserName = (currentUserId: string, user: User) => Md.bold(currentUserId == user.id ? "You" : user.name);

const getOthersLabel = (othersCount: number) =>
  othersCount == 0 ? "" : ` and ${Md.bold(othersCount + " " + pluralize(othersCount, "other", "others"))}`;

const TaskInfo = (userId: string, { user, task: tasks, message_task_due_date: dueDate }: MessageWithOpenTask) => [
  Avatar(user),
  `${UserName(userId, user)} to ${Md.bold("You")}${getOthersLabel(tasks.length - 1)}`,
  dueDate ? `🗓 Due ${Md.bold(mdDate(dueDate?.due_at))}` : undefined,
];

const TopicInfo = (userId: string, topic: TopicWithOpenTask) => [
  Avatar(topic.user),
  `${UserName(userId, topic.user)}${getOthersLabel(topic.topic_member.length - 1)}`,
];

export async function RequestItem(
  userId: string,
  topic: TopicWithOpenTask,
  unreadMessages: number,
  showHighlightContext: boolean
) {
  const mostUrgentMessage = getMostUrgentMessage(topic);
  const userTask = mostUrgentMessage?.task.find((t) => t.user_id == userId);
  const requestType = userTask ? (userTask.type as RequestType) : null;
  return [
    showHighlightContext
      ? Blocks.Context().elements(topic.isDueSoon ? "🔥 Due soon" : undefined, topic.isUnread ? "🔵 Unread" : undefined)
      : undefined,
    Blocks.Section({
      text: Md.bold(topic.name) + (requestType ? "\n" + TaskLabel(requestType) : ""),
    }),
    userTask && Padding,
    Blocks.Context().elements(
      mostUrgentMessage ? TaskInfo(userId, mostUrgentMessage) : TopicInfo(userId, topic),
      unreadMessages
        ? `✉️ ${Md.bold(unreadMessages + " New " + pluralize(unreadMessages, "reply", "replies"))}`
        : undefined
    ),
    Blocks.Actions().elements(
      Elements.Button({
        actionId: "open_view_request_modal",
        value: topic.id,
        text: "View Request",
      }).primary(true),
      Elements.Button({ text: "Open in Acapela", url: await backendGetTopicUrl(topic) }),
      userTask && requestType
        ? Elements.Button({
            text: REQUEST_TYPE_EMOJIS[requestType] + " " + UNCOMPLETED_REQUEST_LABEL[requestType],
            actionId: "toggle_task_done_at:" + userTask.id,
            value: userTask.id,
          })
        : Elements.Button(
            topic.closed_at
              ? { text: "Reopen", actionId: SlackActionIds.ReOpenTopic }
              : { text: "Close", actionId: SlackActionIds.CloseTopic }
          )
            .value(topic.id)
            .danger(true)
    ),
  ];
}
