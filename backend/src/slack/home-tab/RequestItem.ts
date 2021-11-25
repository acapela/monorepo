import { Blocks, Elements, Md } from "slack-block-builder";

import { RichEditorNode } from "~richEditor/content/types";
import { routes } from "~shared/routes";

import { GenerateContext, generateMarkdownFromTipTapJson } from "../md/generator";
import { createSlackLink, mdDate } from "../md/utils";
import { TopicWithOpenTask } from "./types";
import { getMostUrgentTask } from "./utils";

export function RequestItem(topic: TopicWithOpenTask, context: GenerateContext) {
  const { mostUrgentMessage, mostUrgentDueDate } = getMostUrgentTask(topic);
  return [
    Blocks.Section({
      text: [
        createSlackLink(process.env.FRONTEND_URL + routes.topic({ topicSlug: topic.slug }), topic.name) +
          (mostUrgentDueDate ? " - " + Md.italic("due " + mdDate(mostUrgentDueDate)) : ""),
        mostUrgentMessage?.content_text
          ? Md.bold(mostUrgentMessage.user.name + ":") +
            " " +
            generateMarkdownFromTipTapJson(mostUrgentMessage?.content as RichEditorNode, context)
          : "",
      ].join("\n"),
    }).accessory(
      Elements.Button({
        actionId: "open_view_request_modal",
        value: topic.id,
        text: "Open",
      })
    ),
  ];
}
