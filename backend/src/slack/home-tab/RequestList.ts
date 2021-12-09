import { Blocks, Md } from "slack-block-builder";

import { createSlackLink } from "~backend/src/slack/md/utils";
import { pluralize } from "~shared/text/pluralize";

import { RequestItem } from "./RequestItem";
import { TopicWithOpenTask } from "./types";
import { Padding } from "./utils";

const MAX_SHOWN_TOPICS = 10;

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

  const extraTopicsCount = Math.max(topics.length - MAX_SHOWN_TOPICS, 0);

  const nestedTopicsBlocks = await Promise.all(
    topics
      .slice(0, MAX_SHOWN_TOPICS)
      .map(async (topic, i) => [
        ...(await RequestItem(currentUserId, topic, unreadMessagesByTopicId[topic.id] || 0, showHighlightContext)),
        i < topics.length - 1 ? Blocks.Divider() : undefined,
      ])
  );

  const topicBlocks = nestedTopicsBlocks.flat();

  return [
    ...header,
    ...topicBlocks,
    extraTopicsCount > 0
      ? Blocks.Context().elements(
          `There ${pluralize(
            extraTopicsCount,
            "is another topic",
            `are ${Md.bold(String(extraTopicsCount))} more topics`
          )} in this category. ${createSlackLink(process.env.FRONTEND_URL, "Open the web app")} to see ${pluralize(
            extraTopicsCount,
            "it",
            "them"
          )}.`
        )
      : undefined,
  ];
}
