import { Blocks, Md } from "slack-block-builder";

import { GenerateContext } from "../md/generator";
import { RequestItem } from "./RequestItem";
import { TopicWithOpenTask, UnreadMessages } from "./types";

const Padding = [Blocks.Section({ text: " " }), Blocks.Section({ text: " " })];

export async function RequestsList(
  title: string,
  topics: TopicWithOpenTask[],
  context: GenerateContext,
  unreadMessages: UnreadMessages
) {
  const header = [...Padding, Blocks.Header({ text: title })];

  if (topics.length === 0) {
    return [...header, Blocks.Section({ text: Md.italic("No requests here") })];
  }

  const unreadMessagesByTopicId = Object.assign(
    {},
    ...unreadMessages.map((um) => ({ [um.topic_id]: um.unread_messages }))
  );

  const nestedTopicsBlocks = await Promise.all(
    topics.map(async (topic, i) => {
      return [
        ...(await RequestItem(topic, context, unreadMessagesByTopicId[topic.id] || 0)),
        i < topics.length - 1 ? Blocks.Divider() : undefined,
      ];
    })
  );

  const topicBlocks = nestedTopicsBlocks.flat();

  return [...header, ...topicBlocks];
}
