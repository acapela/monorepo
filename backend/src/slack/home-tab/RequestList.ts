import { Blocks, Divider, Elements, Md } from "slack-block-builder";

import { flattenWithDivider } from "@aca/shared/array";
import { isNotFalsy, isNotNullish } from "@aca/shared/nullish";
import { pluralize } from "@aca/shared/text/pluralize";

import { createSlackLink } from "../md/utils";
import { convertDbMessageToSlackMessageSnippet } from "../message/convertToSlack";
import { RequestFooter } from "../RequestFooter";
import { SlackActionIds } from "../utils";
import { TopicWithOpenTask } from "./types";
import { Padding, getMostUrgentMessage } from "./utils";

async function RequestItemHeader(topic: TopicWithOpenTask, unreadMessages: number) {
  const mostUrgentMessage = getMostUrgentMessage(topic.message);

  const messageSnippet = mostUrgentMessage && (await convertDbMessageToSlackMessageSnippet(mostUrgentMessage));

  const topicName = Md.bold(topic.name);
  const nameLine = unreadMessages ? `${topicName} ✉️ ${Md.bold(unreadMessages.toString())}` : topicName;

  return messageSnippet ? [nameLine, messageSnippet].join("\n") : nameLine;
}

export const RequestItem = async (userId: string, topic: TopicWithOpenTask, unreadMessages: number) => [
  Blocks.Section({
    text: await RequestItemHeader(topic, unreadMessages),
  }).accessory(
    Elements.Button({
      actionId: SlackActionIds.OpenViewRequestModal,
      value: topic.id,
      text: "Details",
    })
  ),
  RequestFooter(topic, getMostUrgentMessage(topic.message), userId),
];

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
        pluralize`There ${["is"]} ${extraCountLabel} ${["other", "more"]} ${[
          "topic",
        ]} in this category. ${createSlackLink(process.env.FRONTEND_URL, "Open the web app")} to see ${["it", "them"]}`
      ),
    Padding,
    Padding,
    Padding,
    Padding,
  ].filter(isNotFalsy);
}
