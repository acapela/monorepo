import { Blocks, Elements, Md } from "slack-block-builder";

import { backendGetTopicUrl } from "~backend/src/topics/url";
import { Task } from "~db";
import { RichEditorNode } from "~richEditor/content/types";
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

export async function RequestItem(topic: TopicWithOpenTask, context: GenerateContext) {
  const { mostUrgentMessage, mostUrgentTask, mostUrgentDueDate } = getMostUrgentTask(topic);

  const topicUrl = await backendGetTopicUrl(topic);

  function getTextPieces() {
    const pieces = [createSlackLink(topicUrl, topic.name)];

    if (mostUrgentDueDate) {
      pieces.push(" - " + Md.italic("due " + mdDate(mostUrgentDueDate)));
    }

    if (mostUrgentMessage?.content_text) {
      pieces.push(
        Md.bold(mostUrgentMessage.user.name + ":"),
        generateMarkdownFromTipTapJson(mostUrgentMessage?.content as RichEditorNode, context)
      );
    }

    return pieces;
  }

  const textPieces = getTextPieces();

  return [
    Blocks.Section({
      text: textPieces.join("\n"),
    }).accessory(getAccessoryButton(topic, mostUrgentTask)),
  ];
}
