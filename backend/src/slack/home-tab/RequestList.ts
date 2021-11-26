import { Blocks, Md } from "slack-block-builder";

import { GenerateContext } from "../md/generator";
import { RequestItem } from "./RequestItem";
import { TopicWithOpenTask } from "./types";

const Padding = [Blocks.Section({ text: " " }), Blocks.Section({ text: " " })];

export async function RequestsList(title: string, topics: TopicWithOpenTask[], context: GenerateContext) {
  const header = [...Padding, Blocks.Header({ text: title })];

  if (topics.length === 0) {
    return [...header, Blocks.Section({ text: Md.italic("No requests here") })];
  }

  const nestedTopicsBlocks = await Promise.all(
    topics.map(async (topic, i) => {
      return [...(await RequestItem(topic, context)), i < topics.length - 1 ? Blocks.Divider() : undefined];
    })
  );

  const topicBlocks = nestedTopicsBlocks.flat();

  return [...header, ...topicBlocks];
}
