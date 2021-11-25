import { Elements } from "slack-block-builder";

import { Message, Task, Topic, User, db } from "~db";
import { RichEditorNode } from "~richEditor/content/types";
import { routes } from "~shared/routes";
import { COMPLETED_REQUEST_LABEL, RequestType, UNCOMPLETED_REQUEST_LABEL } from "~shared/types/mention";

import { generateMarkdownFromTipTapJson } from "../md/generator";
import { createSlackLink } from "../md/utils";
import { REQUEST_TYPE_EMOJIS } from "../utils";

export const createTopicLink = (topic: Topic) =>
  createSlackLink(process.env.FRONTEND_URL + routes.topic({ topicSlug: topic.slug }), topic.name);

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

export async function generateMessageTextWithMentions(topic: Topic, message: Message) {
  const teamMembersForTopic = await db.team_member.findMany({
    where: { team_id: topic.team_id },
    include: { user: true, team_member_slack: true },
  });
  const mentionedSlackIdByUsersId = Object.fromEntries(
    teamMembersForTopic.map(({ user, team_member_slack }) => [
      user.id,
      team_member_slack ? { slackId: team_member_slack.slack_user_id } : { name: user.name },
    ])
  );
  return generateMarkdownFromTipTapJson(message.content as RichEditorNode, {
    mentionedSlackIdByUsersId,
  });
}
