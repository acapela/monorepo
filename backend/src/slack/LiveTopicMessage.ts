import { groupBy } from "lodash";
import { Blocks, Elements, Md, Message } from "slack-block-builder";

import { Task, Topic, User, db } from "~db";
import { RichEditorNode } from "~richEditor/content/types";
import { assert, assertDefined } from "~shared/assert";
import { routes } from "~shared/routes";
import { MENTION_TYPE_LABELS, RequestType } from "~shared/types/mention";

import { slackClient } from "./app";
import { generateMarkdownFromTipTapJson } from "./md/generator";
import { createSlackLink, mdDate } from "./md/utils";
import { REQUEST_TYPE_EMOJIS, fetchTeamBotToken, fetchTeamMemberBotToken, findSlackUserId } from "./utils";

const getTasksText = (tasks: (Task & { user: User })[], slackUsers: Record<string, string>) =>
  Object.entries(groupBy(tasks, (task) => task.type))
    .map(([type, tasks]) => {
      const isTaskTypeDone = tasks.every((t) => t.done_at);
      const taskText = `${Md.bold(MENTION_TYPE_LABELS[type as RequestType])} requested from ${tasks
        .map(({ user, done_at }) => {
          const userText = slackUsers[user.id] ? Md.user(slackUsers[user.id]) : Md.italic(user.name);
          return !isTaskTypeDone && done_at ? Md.strike(userText) : userText;
        })
        .join(", ")}`;
      return isTaskTypeDone ? Md.strike(taskText) : taskText;
    })
    .join("\n");

export async function LiveTopicMessage(topic: Topic) {
  const [message, teamMemberSlack] = await Promise.all([
    db.message.findFirst({
      where: { topic_id: topic.id },
      orderBy: [{ created_at: "asc" }],
      include: { task: { include: { user: true } }, message_task_due_date: true },
    }),
    db.team_member_slack.findMany({
      where: {
        team_member: {
          user: { topic_member: { some: { topic_id: topic.id } } },
        },
      },
      include: { team_member: true },
    }),
  ]);

  const mentionedSlackIdByUsersId = teamMemberSlack.map((tm) => ({ [tm.team_member.user_id]: tm.slack_user_id }));

  assert(message, "must have a first message");

  const topicURL = process.env.FRONTEND_URL + routes.topic({ topicSlug: topic.slug });
  const text =
    Md.bold(`[Acapela request] ${createSlackLink(topicURL, topic.name)}`) +
    "\n" +
    generateMarkdownFromTipTapJson(message.content as RichEditorNode, {
      mentionedSlackIdByUsersId: Object.assign({}, ...mentionedSlackIdByUsersId),
    });

  const tasks = message.task;
  const slackUsers: Record<string, string> = Object.fromEntries(
    await Promise.all(tasks.map(async ({ user }) => [user.id, await findSlackUserId(topic.team_id, user)]))
  );
  const dueAt = message.message_task_due_date?.due_at;
  return Message({ text })
    .blocks(
      Blocks.Section({ text }),
      Blocks.Divider(),
      topic.closed_at || tasks.length == 0
        ? Blocks.Section({ text: "🎉 All requests have been actioned. 💪" })
        : [
            Blocks.Section({ text: getTasksText(tasks, slackUsers) }),
            dueAt ? Blocks.Section({ text: Md.italic(`Due ${mdDate(dueAt)}`) }) : undefined,
            tasks.length == 0
              ? undefined
              : Blocks.Actions().elements(
                  tasks.map((task) =>
                    Elements.Button({
                      actionId: "toggle_task_done_at:" + task.id,
                      value: task.id,
                      text: `${task.done_at ? "✅️" : REQUEST_TYPE_EMOJIS[task.type as RequestType]} ${
                        task.user.name
                      }:  ${task.done_at ? "Undo" : "Mark as complete"}`,
                    })
                  )
                ),
          ]
    )
    .buildToObject();
}

export async function tryUpdateTopicSlackMessage(topic: Topic) {
  const topicSlackMessage = await db.topic_slack_message.findUnique({ where: { topic_id: topic.id } });
  if (!topicSlackMessage) {
    return;
  }
  const [teamMemberToken, teamToken] = await Promise.all([
    fetchTeamMemberBotToken(topic.owner_id, topic.team_id),
    fetchTeamBotToken(topic.team_id),
  ]);
  const token = assertDefined(teamMemberToken ?? teamToken, "must have one of the two tokens");
  await slackClient.chat.update({
    ...(await LiveTopicMessage(topic)),
    token,
    channel: topicSlackMessage.slack_channel_id,
    ts: topicSlackMessage.slack_message_ts,
  });
  await db.topic_slack_message.update({
    where: { id: topicSlackMessage.id },
    data: { slack_message_updated_at: new Date().toISOString() },
  });
}
