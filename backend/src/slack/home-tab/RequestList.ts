import { Blocks, Md } from "slack-block-builder";

import { RequestItem } from "./RequestItem";
import { TopicWithOpenTask } from "./types";

const Padding = [Blocks.Section({ text: " " }), Blocks.Section({ text: " " })];

export async function RequestsList({
  title,
  explainer,
  currentUserId,
  topics,
  unreadMessagesByTopicId,
  emptyText = "No requests here",
}: {
  title: string;
  explainer: string;
  currentUserId: string;
  topics: TopicWithOpenTask[];
  unreadMessagesByTopicId: { [topicId: string]: number };
  emptyText?: string;
}) {
  const header = [...Padding, Blocks.Header({ text: title }), Blocks.Context().elements(explainer)];

  if (topics.length === 0) {
    return [...header, Blocks.Section({ text: Md.italic(emptyText) })];
  }

  const nestedTopicsBlocks = await Promise.all(
    topics.map(async (topic, i) => {
      return [
        ...(await RequestItem(currentUserId, topic, unreadMessagesByTopicId[topic.id] || 0)),
        i < topics.length - 1 ? Blocks.Divider() : undefined,
      ];
    })
  );

  const topicBlocks = nestedTopicsBlocks.flat();

  return [...header, ...topicBlocks];
}
