import { Blocks, Elements } from "slack-block-builder";

import { Message, MessageTaskDueDate, Topic, TopicMember, User } from "@aca/db";
import { isNotNullish } from "@aca/shared/nullish";
import { pluralize } from "@aca/shared/text/pluralize";

import { mdDate } from "./md/utils";
import { PriorityLabel, isRequestDueSoon } from "./utils";

const Avatar = (user: User) =>
  user.avatar_url ? Elements.Img({ imageUrl: user.avatar_url ?? undefined, altText: user.name }) : undefined;

const UserName = (user: User, currentUserId?: string) => (currentUserId == user.id ? "You" : user.name);

const getOthersLabel = (othersCount: number) =>
  othersCount == 0 ? "" : ` and ${othersCount + " " + pluralize(othersCount, "other", "others")}`;

type TopicUserInfoTopic = Topic & { user: User; topic_member: TopicMember[] };
const TopicUserInfo = (topic: TopicUserInfoTopic, currentUserId?: string) =>
  [Avatar(topic.user), `${UserName(topic.user, currentUserId)}${getOthersLabel(topic.topic_member.length - 1)}`].filter(
    isNotNullish
  );

export type RequestFooterTopic = Topic & TopicUserInfoTopic;
export const RequestFooter = (
  topic: RequestFooterTopic,
  message?: Message & { message_task_due_date: null | MessageTaskDueDate },
  currentUserId?: string
) => {
  const dueDate = message?.message_task_due_date;
  const dueAt = dueDate?.due_at;

  function getContextHighlight() {
    const parts: Array<string | null> = [];
    if (dueAt) {
      if (isRequestDueSoon(dueDate)) {
        parts.push(`🔥 Due soon - ${mdDate(dueAt)}`);
      } else {
        parts.push(`Due ${mdDate(dueAt)}`);
      }
    }

    if (topic.priority) {
      parts.push(PriorityLabel(topic.priority) ?? null);
    }

    const existingParts = parts.filter(isNotNullish);

    if (!existingParts.length) return null;

    return existingParts;
  }

  const contextHighlightNode = getContextHighlight() ?? [];

  return Blocks.Context().elements(...TopicUserInfo(topic, currentUserId), ...contextHighlightNode);
};
