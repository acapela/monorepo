import { Blocks, Md } from "slack-block-builder";

import { RequestItem } from "./RequestItem";
import { TopicWithOpenTask } from "./types";
import { Padding } from "./utils";

export async function RequestsList({
  title,
  explainer,
  currentUserId,
  topics,
  unreadMessagesByTopicId,
  emptyText = "No requests here",
  showHighlightContext = false,
}: {
  title: string;
  explainer: string;
  currentUserId: string;
  topics: TopicWithOpenTask[];
  unreadMessagesByTopicId: { [topicId: string]: number };
  emptyText?: string;
  showHighlightContext?: boolean;
}) {
  const header = [Padding, Padding, Blocks.Header({ text: title }), Blocks.Context().elements(explainer), Padding];

  if (topics.length === 0) {
    return [...header, Blocks.Section({ text: Md.italic(emptyText) })];
  }

  const nestedTopicsBlocks = await Promise.all(
    topics.map(async (topic, i) => [
      ...(await RequestItem(currentUserId, topic, unreadMessagesByTopicId[topic.id] || 0, showHighlightContext)),
      i < topics.length - 1 ? Blocks.Divider() : undefined,
    ])
  );

  const topicBlocks = nestedTopicsBlocks.flat();

  return [...header, ...topicBlocks];
}
