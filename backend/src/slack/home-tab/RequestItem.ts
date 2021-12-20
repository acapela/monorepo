import { Blocks, Elements, Md } from "slack-block-builder";

import { mdDate } from "~backend/src/slack/md/utils";
import { PriorityLabel, SlackActionIds } from "~backend/src/slack/utils";
import { User } from "~db";
import { pluralize } from "~shared/text/pluralize";

import { MessageWithOpenTask, TopicWithOpenTask } from "./types";
import { getMostUrgentMessage } from "./utils";

const Avatar = (user: User) =>
  user.avatar_url ? Elements.Img({ imageUrl: user.avatar_url ?? undefined, altText: user.name }) : undefined;

const UserName = (currentUserId: string, user: User) => Md.bold(currentUserId == user.id ? "You" : user.name);

const getOthersLabel = (othersCount: number) =>
  othersCount == 0 ? "" : ` and ${Md.bold(othersCount + " " + pluralize(othersCount, "other", "others"))}`;

const TaskInfo = (userId: string, { user, task: tasks }: MessageWithOpenTask) => [
  Avatar(user),
  UserName(userId, user) + (tasks.length == 1 ? "" : " to " + Md.bold("You") + getOthersLabel(tasks.length - 1)),
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
  const dueAt = mostUrgentMessage?.message_task_due_date?.due_at;
  return [
    showHighlightContext
      ? Blocks.Context().elements(topic.isDueSoon ? "🔥 Due soon" : undefined, topic.isUnread ? "🔵 Unread" : undefined)
      : undefined,
    Blocks.Section({
      text: Md.bold(topic.name) + "\n" + (dueAt ? `Due ${mdDate(dueAt)}` : Md.italic("No due date set yet")),
    }).accessory(
      Elements.Button({
        actionId: SlackActionIds.OpenViewRequestModal,
        value: topic.id,
        text: "View Request",
      }).primary(true)
    ),
    Blocks.Context().elements(
      mostUrgentMessage ? TaskInfo(userId, mostUrgentMessage) : TopicInfo(userId, topic),
      PriorityLabel(topic.priority),
      unreadMessages
        ? `✉️ ${Md.bold(unreadMessages + " New " + pluralize(unreadMessages, "reply", "replies"))}`
        : undefined
    ),
  ];
}
