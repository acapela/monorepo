import { Blocks, Md } from "slack-block-builder";

import { pluralize } from "~shared/text/pluralize";

import { GenerateContext } from "../md/generator";
import { createSlackLink } from "../md/utils";
import { RequestItem } from "./RequestItem";
import { TopicRowsWithCount } from "./types";

const Padding = [Blocks.Section({ text: " " }), Blocks.Section({ text: " " })];

export function RequestsList(title: string, topics: TopicRowsWithCount, context: GenerateContext) {
  const extraRequestsCount = topics.count - topics.rows.length;
  return [
    ...Padding,
    Blocks.Header({ text: title }),
    ...(topics.count === 0
      ? [Blocks.Section({ text: Md.italic("No requests here") })]
      : topics.rows.flatMap((topic, i) => [
          ...RequestItem(topic, context),
          i < topics.rows.length - 1 ? Blocks.Divider() : undefined,
        ])),
    ...(extraRequestsCount > 0
      ? [
          Blocks.Divider(),
          Blocks.Section({
            text: Md.italic(
              `There ${pluralize(extraRequestsCount, "is another topic", "are more topics")} ${Md.bold(
                extraRequestsCount.toString()
              )} in this category. ${createSlackLink(process.env.FRONTEND_URL, "Open the web app")} to see ${pluralize(
                extraRequestsCount,
                "it",
                "them"
              )}.`
            ),
          }),
        ]
      : []),
  ];
}
