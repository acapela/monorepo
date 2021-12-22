import { Blocks, Elements, Md } from "slack-block-builder";

import { mdDate } from "~backend/src/slack/md/utils";
import { PriorityLabel, SlackActionIds } from "~backend/src/slack/utils";
import { User } from "~db";
import { RichEditorNode } from "~richEditor/content/types";
import { isNotNullish } from "~shared/nullish";
import { pluralize } from "~shared/text/pluralize";

import { generateSlackMarkdownSnippetFromMessage } from "../md/generator";
import { TopicWithOpenTask } from "./types";
import { getMostUrgentMessage } from "./utils";

const Avatar = (user: User) =>
  user.avatar_url ? Elements.Img({ imageUrl: user.avatar_url ?? undefined, altText: user.name }) : undefined;

const UserName = (currentUserId: string, user: User) => (currentUserId == user.id ? "You" : user.name);

const getOthersLabel = (othersCount: number) =>
  othersCount == 0 ? "" : ` and ${othersCount + " " + pluralize(othersCount, "other", "others")}`;

const TopicInfo = (userId: string, topic: TopicWithOpenTask) =>
  [Avatar(topic.user), `${UserName(userId, topic.user)}${getOthersLabel(topic.topic_member.length - 1)}`].filter(
    isNotNullish
  );

const RequestFooter = (userId: string, topic: TopicWithOpenTask) => {
  const mostUrgentMessage = getMostUrgentMessage(topic);
  const dueAt = mostUrgentMessage?.message_task_due_date?.due_at;

  function getContextHighlight() {
    const parts: Array<string | null> = [];
    if (dueAt) {
      if (topic.isDueSoon) {
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

  return Blocks.Context().elements(...TopicInfo(userId, topic), ...contextHighlightNode);
};

export async function RequestItemHeader(topic: TopicWithOpenTask, unreadMessages: number) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const mostUrgentMessage = getMostUrgentMessage(topic)!;

  const messageSnippet = await generateSlackMarkdownSnippetFromMessage(
    mostUrgentMessage.content as RichEditorNode,
    mostUrgentMessage.id
  );

  function getNameNode() {
    const topicName = Md.bold(topic.name);
    const parts: Array<string | null> = [topicName];

    if (unreadMessages) {
      parts.push(`✉️ ${Md.bold(unreadMessages.toString())}`);
    }

    return parts.filter(isNotNullish).join(" ");
  }

  function getTaskLines() {
    const name = getNameNode();

    return [name, messageSnippet];
  }

  return getTaskLines().join("\n");
}

export async function RequestItem(userId: string, topic: TopicWithOpenTask, unreadMessages: number) {
  return [
    Blocks.Section({
      text: await RequestItemHeader(topic, unreadMessages),
    }).accessory(
      Elements.Button({
        actionId: SlackActionIds.OpenViewRequestModal,
        value: topic.id,
        text: "Details",
      })
    ),
    RequestFooter(userId, topic),
  ];
}
