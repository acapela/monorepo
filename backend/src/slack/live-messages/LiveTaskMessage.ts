import { Prisma } from "@prisma/client";
import { Blocks, Elements, Md, Message as SlackMessage } from "slack-block-builder";

import { DecisionOptionVoting, DecisionOptionWithVotes } from "@aca/backend/src/slack/decision";
import { Message, MessageTaskDueDate, Task, Topic, db } from "@aca/db";
import { assert, assertDefined } from "@aca/shared/assert";
import { logger } from "@aca/shared/logger";
import { MENTION_TYPE_LABELS, MentionType, REQUEST_DECISION } from "@aca/shared/requests";

import { slackClient } from "../app";
import { convertDbMessageToSlackMessage } from "../message/convertToSlack";
import { RequestFooter, RequestFooterTopic } from "../RequestFooter";
import { SlackActionIds, fetchTeamBotToken } from "../utils";
import { ToggleTaskDoneAtButton, createTopicLink } from "./utils";

type TaskDetail = Task & {
  message: Message & {
    topic: Topic & RequestFooterTopic;
    message_task_due_date: MessageTaskDueDate | null;
    decision_option: DecisionOptionWithVotes[];
  };
};

const TaskAction = (task: TaskDetail) =>
  task.type === REQUEST_DECISION
    ? DecisionOptionVoting(task.message.decision_option, {})
    : Blocks.Actions().elements(
        ToggleTaskDoneAtButton(task),
        Elements.Button({
          actionId: SlackActionIds.OpenViewRequestModal,
          value: task.message.topic_id,
          text: "View Request",
        })
      );

export async function LiveTaskMessage(task: TaskDetail) {
  const message = task.message;
  const topic = message.topic;

  const [author, messageText] = await Promise.all([
    db.team_member.findFirst({
      where: { team_id: topic.team_id, user: { id: message.user_id, topic_member: { some: { topic_id: topic.id } } } },
      include: { user: true, team_member_slack: true },
    }),
    convertDbMessageToSlackMessage(message),
  ]);
  assert(author, `missing author for message ${message.id}`);
  const authorLabel = author.team_member_slack ? Md.user(author.team_member_slack.slack_user_id) : author.user.name;
  const requestType = Md.bold(MENTION_TYPE_LABELS[task.type as MentionType]);
  const text = [
    `${authorLabel} has asked for your ${requestType} in ${await createTopicLink(topic)}:`,
    Md.blockquote(messageText),
  ].join("\n");

  return SlackMessage({ text })
    .blocks(
      Blocks.Section({ text }),
      RequestFooter(topic, message, task.user_id),
      Blocks.Divider(),
      topic.closed_at ? Blocks.Section({ text: "The topic has been closed ✅️" }) : TaskAction(task)
    )
    .buildToObject();
}

export async function tryUpdateTaskSlackMessages(where: {
  taskSlackMessage: Prisma.task_slack_messageWhereInput;
  message: Prisma.messageWhereInput;
}) {
  const [taskSlackMessages, messages] = await Promise.all([
    db.task_slack_message.findMany({ where: where.taskSlackMessage, include: { task: true } }),
    // fetch messages separately as topic/message changes can cause many updates for the same message with multiple tasks
    db.message.findMany({
      where: where.message,
      include: {
        topic: { include: { user: true, topic_member: true } },
        message_task_due_date: true,
        decision_option: { include: { decision_vote: { include: { user: true } } } },
      },
    }),
  ]);

  const [firstMessage] = messages;
  if (!firstMessage) {
    return;
  }
  const teamId = firstMessage.topic.team_id;
  const botToken = assertDefined(await fetchTeamBotToken(teamId), `must have a token for team ${teamId}`);

  const messagesById = Object.fromEntries(messages.map((message) => [message.id, message]));

  try {
    await Promise.all(
      taskSlackMessages.map(async ({ task, ...taskSlackMessage }) => {
        const message = messagesById[task.message_id];
        assert(message, "missing message for task_slack_message " + taskSlackMessage.id);
        await slackClient.chat.update({
          ...(await LiveTaskMessage({ ...task, message })),
          token: botToken,
          channel: taskSlackMessage.slack_channel_id,
          ts: taskSlackMessage.slack_message_ts,
        });
        await db.task_slack_message.update({
          where: { id: taskSlackMessage.id },
          data: { slack_message_updated_at: new Date().toISOString() },
        });
      })
    );
  } catch (error) {
    logger.error(error, "error while updating task slack message");
  }
}
