import { Blocks, Elements, Md } from "slack-block-builder";

import { Task } from "~db";
import { RichEditorNode } from "~richEditor/content/types";
import { routes } from "~shared/routes";
import { RequestType, UNCOMPLETED_REQUEST_LABEL } from "~shared/types/mention";

import { GenerateContext, generateMarkdownFromTipTapJson } from "../md/generator";
import { createSlackLink, mdDate } from "../md/utils";
import { REQUEST_TYPE_EMOJIS, SlackActionIds } from "../utils";
import { TopicWithOpenTask } from "./types";
import { getMostUrgentTask } from "./utils";

function getAccessoryButton(topic: TopicWithOpenTask, mostUrgentOpenTask?: Task) {
  if (!topic.closed_at) {
    // Still has some tasks open
    if (mostUrgentOpenTask) {
      return Elements.Button({
        actionId: "toggle_task_done_at:" + mostUrgentOpenTask.id,
        value: mostUrgentOpenTask.id,
        text: `${REQUEST_TYPE_EMOJIS[mostUrgentOpenTask.type as RequestType]} ${
          UNCOMPLETED_REQUEST_LABEL[mostUrgentOpenTask.type as RequestType]
        }`,
      });
    }
    return Elements.Button({
      actionId: SlackActionIds.CloseTopic,
      value: topic.id,
      text: `✅ Close`,
    });
  }

  return Elements.Button({
    actionId: SlackActionIds.ArchiveTopic,
    value: topic.id,
    text: `🔒 Archive`,
  });
}

export function RequestItem(topic: TopicWithOpenTask, context: GenerateContext) {
  const { mostUrgentMessage, mostUrgentTask, mostUrgentDueDate } = getMostUrgentTask(topic);
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
    }).accessory(getAccessoryButton(topic, mostUrgentTask)),
  ];
}
