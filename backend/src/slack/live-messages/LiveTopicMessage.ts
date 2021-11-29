import { groupBy } from "lodash";
import { Blocks, Md, Message as SlackMessage } from "slack-block-builder";

import { logger } from "~backend/src/logger";
import { Message, Task, Topic, User, db } from "~db";
import { assert, assertDefined } from "~shared/assert";
import { MENTION_TYPE_LABELS, RequestType } from "~shared/types/mention";

import { slackClient } from "../app";
import { mdDate } from "../md/utils";
import { fetchTeamBotToken, fetchTeamMemberBotToken, findSlackUserId } from "../utils";
import { ToggleTaskDoneAtButton, createTopicLink, generateMessageTextWithMentions } from "./utils";

const makeSlackMessageTextWithContent = async (topic: Topic, message: Message) =>
  Md.bold(`[Acapela request] ${await createTopicLink(topic)}`) +
  "\n" +
  (await generateMessageTextWithMentions(topic, message));

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

export async function LiveTopicMessage(topic: Topic, options?: { isMessageContentExcluded?: boolean }) {
  const message = await db.message.findFirst({
    where: { topic_id: topic.id },
    orderBy: [{ created_at: "asc" }],
    include: { task: { include: { user: true } }, message_task_due_date: true },
  });

  assert(message, "must have a first message");

  const text = options?.isMessageContentExcluded
    ? Md.bold(`Made Acapela Request ➡️ ${await createTopicLink(topic)}`)
    : await makeSlackMessageTextWithContent(topic, message);

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
              : Blocks.Actions().elements(tasks.map((task) => ToggleTaskDoneAtButton(task, task.user))),
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
  try {
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
  } catch (error) {
    logger.error(error, "error while updating topic slack message");
  }
}
