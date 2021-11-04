import { groupBy } from "lodash";
import { Blocks, Elements, Md, Message } from "slack-block-builder";

import { createSlackLink } from "~backend/src/notifications/sendNotification";
import { slackClient } from "~backend/src/slack/app";
import {
  REQUEST_TYPE_EMOJIS,
  fetchTeamBotToken,
  fetchTeamMemberBotToken,
  findSlackUserId,
} from "~backend/src/slack/utils";
import { Topic, db } from "~db";
import { convertMessageContentToPlainText } from "~richEditor/content/plainText";
import { assert, assertDefined } from "~shared/assert";
import { routes } from "~shared/routes";
import { MENTION_TYPE_LABELS, RequestType } from "~shared/types/mention";

export async function LiveTopicMessage(topic: Topic) {
  const message = await db.message.findFirst({
    where: { topic_id: topic.id },
    orderBy: [{ created_at: "asc" }],
    include: { task: { include: { user: true } } },
  });
  assert(message, "must have a first message");

  const topicURL = process.env.FRONTEND_URL + routes.topic({ topicSlug: topic.slug });
  const text =
    Md.bold(`[Acapela request] ${createSlackLink(topicURL, topic.name)}`) +
    "\n" +
    convertMessageContentToPlainText(message.content as never);

  const tasks = message.task;
  const slackUsers: Record<string, string> = Object.fromEntries(
    await Promise.all(tasks.map(async ({ user }) => [user.id, await findSlackUserId(topic.team_id, user)]))
  );
  return Message({ text })
    .blocks(
      Blocks.Section({ text }),
      Blocks.Divider(),
      topic.closed_at
        ? Blocks.Section({ text: "🎉 All requests have been actioned. The topic is now closed. 💪" })
        : [
            Blocks.Section({
              text: Object.entries(groupBy(tasks, (task) => task.type))
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
                .join("\n"),
            }),
            Blocks.Actions().elements(
              tasks.map((task) =>
                Elements.Button({
                  actionId: "toggle_task_done_at:" + task.id,
                  value: task.id,
                  text: `${task.done_at ? "✅️" : REQUEST_TYPE_EMOJIS[task.type as RequestType]} ${task.user.name}:  ${
                    task.done_at ? "Undo" : "Mark as complete"
                  }`,
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
