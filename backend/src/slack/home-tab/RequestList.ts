import { Blocks, Divider, Md } from "slack-block-builder";

import { createSlackLink } from "~backend/src/slack/md/utils";
import { flattenWithDivider } from "~shared/array";
import { isNotFalsy, isNotNullish } from "~shared/nullish";
import { pluralize } from "~shared/text/pluralize";

import { RequestItem } from "./RequestItem";
import { TopicWithOpenTask } from "./types";
import { Padding } from "./utils";

export type RequestListParams = {
  title: string;
  explainer: string;
  currentUserId: string;
  topics: TopicWithOpenTask[];
  unreadMessagesByTopicId: { [topicId: string]: number };
  emptyText?: string;
  showHighlightContext?: boolean;
  maxShownTopics?: number;
};

export async function RequestsList({
  title,
  explainer,
  currentUserId,
  topics,
  unreadMessagesByTopicId,
  maxShownTopics = 2,
}: RequestListParams) {
  const header = [Blocks.Header({ text: title }), Blocks.Context().elements(explainer)];

  if (topics.length === 0) {
    return [];
  }

  const extraTopicsCount = Math.max(topics.length - maxShownTopics, 0);

  const nestedTopicsBlocks = await Promise.all(
    topics
      .slice(0, maxShownTopics)
      .map(async (topic) => [...(await RequestItem(currentUserId, topic, unreadMessagesByTopicId[topic.id] || 0))])
  );

  const topicBlocks = flattenWithDivider(nestedTopicsBlocks, () => Divider()).filter(isNotNullish);

  const extraCountLabel = Md.bold(String(extraTopicsCount));

  return [
    ...header,
    ...topicBlocks,
    extraTopicsCount > 0 &&
      Blocks.Context().elements(
        `There ${pluralize(
          extraTopicsCount,
          `is ${extraCountLabel} other topic`,
          `are ${extraCountLabel} more topics`
        )} in this category. ${createSlackLink(process.env.FRONTEND_URL, "Open the web app")} to see ${pluralize(
          extraTopicsCount,
          "it",
          "them"
        )}.`
      ),
    Padding,
    Padding,
    Padding,
    Padding,
  ].filter(isNotFalsy);
}
