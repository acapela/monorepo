import { Blocks, Elements, Md } from "slack-block-builder";

import { backendGetTopicUrl } from "~backend/src/topics/url";
import { RichEditorNode } from "~richEditor/content/types";

import { GenerateContext, generateMarkdownFromTipTapJson } from "../md/generator";
import { createSlackLink, mdDate } from "../md/utils";
import { TopicWithOpenTask } from "./types";
import { getMostUrgentTask } from "./utils";

export async function RequestItem(topic: TopicWithOpenTask, context: GenerateContext, unreadMessages: number) {
  const { mostUrgentMessage, mostUrgentDueDate } = getMostUrgentTask(topic);
  const unreadPrefix = unreadMessages ? `*(${unreadMessages} unread)* ` : "";
  return [
    Blocks.Section({
      text:
        unreadPrefix +
        [
          createSlackLink(await backendGetTopicUrl(topic), topic.name) +
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
        text: "View Request",
      })
    ),
  ];
}
