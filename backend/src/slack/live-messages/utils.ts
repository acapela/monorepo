import { Elements } from "slack-block-builder";

import { backendGetTopicUrl } from "@aca/backend/src/topics/url";
import { Task, Topic, User } from "@aca/db";
import { COMPLETED_REQUEST_LABEL, RequestType, UNCOMPLETED_REQUEST_LABEL } from "@aca/shared/requests";

import { createSlackLink } from "../md/utils";
import { REQUEST_TYPE_EMOJIS } from "../utils";

export const createTopicLink = async (topic: Topic, accessToken?: string) =>
  createSlackLink(await backendGetTopicUrl(topic, accessToken), topic.name.replaceAll("\n", " "));

export const ToggleTaskDoneAtButton = (task: Task, user?: User) => {
  const type = task.type as RequestType;
  return Elements.Button({
    actionId: "toggle_task_done_at:" + task.id,
    value: task.id,
    text:
      (task.done_at ? "✅️" : REQUEST_TYPE_EMOJIS[type]) +
      (user ? ` ${user.name}:` : "") +
      " " +
      (task.done_at ? COMPLETED_REQUEST_LABEL : UNCOMPLETED_REQUEST_LABEL)[type],
  });
};
