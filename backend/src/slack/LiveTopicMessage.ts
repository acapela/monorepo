import { groupBy } from "lodash";
import { Blocks, Elements, Md, Message as SlackMessage } from "slack-block-builder";

import { Message, Task, Topic, User, db } from "~db";
import { RichEditorNode } from "~richEditor/content/types";
import { assert, assertDefined } from "~shared/assert";
import { routes } from "~shared/routes";
import { MENTION_TYPE_LABELS, RequestType, getUncompletedTaskLabel } from "~shared/types/mention";

import { slackClient } from "./app";
import { SlackMentionContext, generateMarkdownFromTipTapJson } from "./md/generator";
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

function makeSlackMessageTextWithContent(
  topic: Topic,
  message: Message,
  mentionedSlackIdByUsersId: { [userId: string]: SlackMentionContext }
) {
  const topicURL = process.env.FRONTEND_URL + routes.topic({ topicSlug: topic.slug });
  return (
    Md.bold(`[Acapela request] ${createSlackLink(topicURL, topic.name)}`) +
    "\n" +
    generateMarkdownFromTipTapJson(message.content as RichEditorNode, {
      mentionedSlackIdByUsersId,
    })
  );
}

function makeSlackMessageTextWithoutContent(topic: Topic) {
  const topicURL = process.env.FRONTEND_URL + routes.topic({ topicSlug: topic.slug });
  return Md.bold(`Made Acapela Request ➡️ ${createSlackLink(topicURL, topic.name)}`);
}

export async function LiveTopicMessage(topic: Topic, options?: { isMessageContentExcluded?: boolean }) {
  const [message, teamMemberSlack, teamMemberTopic] = await Promise.all([
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
    db.team_member.findMany({
      where: {
        user: { topic_member: { some: { topic_id: topic.id } } },
      },
      include: { user: true },
    }),
  ]);

  const mentionedSlackIdByUsersId = Object.assign(
    {},
    ...teamMemberTopic.map((tm) => ({ [tm.user_id]: { name: tm.user.name } })),
    ...teamMemberSlack.map((tm) => ({
      [tm.team_member.user_id]: { slackId: tm.slack_user_id },
    }))
  );

  assert(message, "must have a first message");

  const text = options?.isMessageContentExcluded
    ? makeSlackMessageTextWithoutContent(topic)
    : makeSlackMessageTextWithContent(topic, message, mentionedSlackIdByUsersId);

  const tasks = message.task;
  const slackUsers: Record<string, string> = Object.fromEntries(
    await Promise.all(tasks.map(async ({ user }) => [user.id, await findSlackUserId(topic.team_id, user)]))
  );
  const dueAt = message.message_task_due_date?.due_at;
  return SlackMessage({ text })
    .blocks(
      Blocks.Section({ text }),
      Blocks.Divider(),
      topic.closed_at || tasks.length == 0
        ? Blocks.Section({ text: "All tasks have been completed 🎉" })
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
                      }:  ${task.done_at ? "Undo" : getUncompletedTaskLabel(task.type as RequestType)}`,
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
    ...(await LiveTopicMessage(topic, {
      isMessageContentExcluded: topicSlackMessage.is_excluding_content ?? undefined,
    })),
    token,
    channel: topicSlackMessage.slack_channel_id,
    ts: topicSlackMessage.slack_message_ts,
  });
  await db.topic_slack_message.update({
    where: { id: topicSlackMessage.id },
    data: { slack_message_updated_at: new Date().toISOString() },
  });
}
