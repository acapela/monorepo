import { Blocks, Md } from "slack-block-builder";

import { GenerateContext } from "../md/generator";
import { RequestItem } from "./RequestItem";
import { TopicWithOpenTask } from "./types";

const Padding = [Blocks.Section({ text: " " }), Blocks.Section({ text: " " })];

export function RequestsList(title: string, topics: TopicWithOpenTask[], context: GenerateContext) {
  return [
    ...Padding,
    Blocks.Header({ text: title }),
    ...(topics.length === 0
      ? [Blocks.Section({ text: Md.italic("No requests here") })]
      : topics.flatMap((topic, i) => [
          ...RequestItem(topic, context),
          i < topics.length - 1 ? Blocks.Divider() : undefined,
        ])),
  ];
}
