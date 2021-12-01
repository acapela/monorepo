import { Prisma } from "@prisma/client";
import { Blocks, Md, Message as SlackMessage } from "slack-block-builder";

import { Message, MessageTaskDueDate, Task, Topic, db } from "~db";
import { assert, assertDefined } from "~shared/assert";
import { logger } from "~shared/logger";
import { MENTION_TYPE_LABELS, MentionType } from "~shared/types/mention";

import { slackClient } from "../app";
import { mdDate } from "../md/utils";
import { fetchTeamBotToken } from "../utils";
import { ToggleTaskDoneAtButton, createTopicLink, generateMessageTextWithMentions } from "./utils";

type TaskDetail = Task & {
  message: Message & { topic: Topic; message_task_due_date: MessageTaskDueDate | null };
};

export async function LiveTaskMessage(task: TaskDetail) {
  const message = task.message;
  const topic = message.topic;

  const [author, messageText] = await Promise.all([
    db.team_member.findFirst({
      where: { team_id: topic.team_id, user: { id: message.user_id, topic_member: { some: { topic_id: topic.id } } } },
      include: { user: true, team_member_slack: true },
    }),
    generateMessageTextWithMentions(topic, message),
  ]);
  assert(author, `missing author for message ${message.id}`);
  const authorLabel = author.team_member_slack ? Md.user(author.team_member_slack.slack_user_id) : author.user.name;
  const requestType = Md.bold(MENTION_TYPE_LABELS[task.type as MentionType]);
  const text =
    `${authorLabel} has asked for your ${requestType} in ${await createTopicLink(topic)}:\n` +
    Md.blockquote(messageText);

  const dueAt = message.message_task_due_date?.due_at;
  return SlackMessage({ text })
    .blocks(
      Blocks.Section({ text }),
      Blocks.Divider(),
      topic.closed_at
        ? Blocks.Section({ text: "The topic has been closed ✅️" })
        : [
            dueAt ? Blocks.Section({ text: Md.italic(`Due ${mdDate(dueAt)}`) }) : undefined,
            Blocks.Actions().elements(ToggleTaskDoneAtButton(task)),
          ]
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
    db.message.findMany({ where: where.message, include: { topic: true, message_task_due_date: true } }),
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
