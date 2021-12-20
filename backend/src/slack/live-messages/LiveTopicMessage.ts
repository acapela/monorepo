import { groupBy } from "lodash";
import { Blocks, Elements, Md, Message as SlackMessage } from "slack-block-builder";

import { Message, Task, Topic, TopicAccessToken, User, db } from "~db";
import { assert, assertDefined } from "~shared/assert";
import { logger } from "~shared/logger";
import { REQUEST_DECISION, REQUEST_NOTIFICATION_LABELS, RequestType } from "~shared/requests";

import { slackClient } from "../app";
import { DecisionOptionVoting } from "../decision";
import { mdDate } from "../md/utils";
import { SlackActionIds, fetchTeamBotToken, fetchTeamMemberToken, findSlackUserId } from "../utils";
import { ToggleTaskDoneAtButton, createTopicLink, generateMessageTextWithMentions } from "./utils";

const makeSlackMessageTextWithContent = async (topic: Topic, message: Message, accessToken?: string) =>
  Md.bold(`[Acapela request] ${await createTopicLink(topic, accessToken)}`) +
  "\n" +
  (await generateMessageTextWithMentions(topic, message));

const getTasksText = (tasks: (Task & { user: User })[], slackUsers: Record<string, string>) =>
  Object.entries(groupBy(tasks, (task) => task.type))
    .map(([type, tasks]) => {
      const isTaskTypeDone = tasks.every((t) => t.done_at);
      const taskText = `${Md.bold(REQUEST_NOTIFICATION_LABELS[type as RequestType])} created for ${tasks
        .map(({ user, done_at }) => {
          const userText = slackUsers[user.id] ? Md.user(slackUsers[user.id]) : Md.italic(user.name);
          return !isTaskTypeDone && done_at ? Md.strike(userText) : userText;
        })
        .join(", ")}`;
      return isTaskTypeDone ? Md.strike(taskText) : taskText;
    })
    .join("\n");

export type TopicWithToken = Topic & { topic_access_token?: TopicAccessToken[] };

export async function LiveTopicMessage(topic: TopicWithToken, options?: { isMessageContentExcluded?: boolean }) {
  const [message, accessToken] = await Promise.all([
    db.message.findFirst({
      where: { topic_id: topic.id },
      orderBy: [{ created_at: "asc" }],
      include: {
        task: { include: { user: true } },
        message_task_due_date: true,
        decision_option: { include: { decision_vote: { include: { user: true } } } },
      },
    }),
    topic.topic_access_token
      ? topic.topic_access_token[0]
      : db.topic_access_token.findFirst({ where: { topic_id: topic.id } }),
  ]);

  assert(message, `must have a first message for topic ${topic.id}`);

  const text = options?.isMessageContentExcluded
    ? Md.italic("New Acapela Request Created:") + `\n> "${Md.bold(topic.name)}"`
    : await makeSlackMessageTextWithContent(topic, message, accessToken?.token);

  const tasks = message.task;
  const slackUsers: Record<string, string> = Object.fromEntries(
    await Promise.all(tasks.map(async ({ user }) => [user.id, await findSlackUserId(topic.team_id, user)]))
  );
  const dueAt = message.message_task_due_date?.due_at;
  const nonDecisionTasks = tasks.filter((task) => task.type !== REQUEST_DECISION);
  return SlackMessage({ text })
    .blocks(
      Blocks.Section({ text }).accessory(
        Elements.Button({
          actionId: SlackActionIds.OpenViewRequestModal,
          value: topic.id,
          text: "View Request",
        }).primary(true)
      ),
      Blocks.Divider(),
      message.decision_option.length == 0
        ? undefined
        : [...DecisionOptionVoting(message.decision_option, slackUsers), Blocks.Divider()],
      topic.closed_at || tasks.length == 0
        ? Blocks.Section({ text: "All tasks have been completed 🎉" })
        : [
            Blocks.Section({ text: getTasksText(tasks, slackUsers) }),
            dueAt ? Blocks.Section({ text: Md.italic(`Due ${mdDate(dueAt)}`) }) : undefined,
            nonDecisionTasks.length == 0
              ? undefined
              : Blocks.Actions().elements(nonDecisionTasks.map((task) => ToggleTaskDoneAtButton(task, task.user))),
          ]
    )
    .buildToObject();
}

export async function tryUpdateTopicSlackMessage(topic: TopicWithToken) {
  const topicSlackMessage = await db.topic_slack_message.findUnique({ where: { topic_id: topic.id } });
  if (!topicSlackMessage) {
    return;
  }
  const [teamMemberToken, teamToken] = await Promise.all([
    fetchTeamMemberToken(topic.owner_id, topic.team_id),
    fetchTeamBotToken(topic.team_id),
  ]);
  const token = assertDefined(
    topicSlackMessage.was_sent_by_bot ? teamToken : teamMemberToken,
    `must have token for topic slack message ${topicSlackMessage.id}`
  );
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
