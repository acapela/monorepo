import { App, BlockButtonAction } from "@slack/bolt";
import { groupBy } from "lodash";
import { Blocks, Elements, Md, Modal, Message as SlackMessage } from "slack-block-builder";

import { DecisionOption, DecisionVote, Message, Task, Topic, TopicAccessToken, User, db } from "~db";
import { assert, assertDefined } from "~shared/assert";
import { logger } from "~shared/logger";
import { routes } from "~shared/routes";
import { REQUEST_DECISION, REQUEST_NOTIFICATION_LABELS, RequestType } from "~shared/types/mention";

import { slackClient } from "../app";
import { createSlackLink, mdDate } from "../md/utils";
import {
  SlackActionIds,
  assertToken,
  fetchTeamBotToken,
  fetchTeamMemberToken,
  findSlackUserId,
  findUserBySlackId,
} from "../utils";
import { ToggleTaskDoneAtButton, createTopicLink, generateMessageTextWithMentions } from "./utils";

const DECISION_VOTE_ACTION_ID = "decision_option-vote";

export function setupLiveTopicMessage(app: App) {
  app.action<BlockButtonAction>(DECISION_VOTE_ACTION_ID, async ({ ack, action, client, body, context }) => {
    await ack();

    const token = assertToken(context);
    const user = await findUserBySlackId(token, body.user.id);

    const decisionOption = user
      ? await db.decision_option.findFirst({
          where: { id: action.value, message: { task: { some: { user_id: user.id, type: REQUEST_DECISION } } } },
          include: { decision_vote: { where: { user_id: user.id } } },
        })
      : null;

    if (!user || !decisionOption) {
      await client.views.open({
        trigger_id: body.trigger_id,
        view: Modal({ title: "No Vote" })
          .blocks(
            user
              ? Blocks.Section({
                  text: "You were not asked to vote in this decision, so this button does not do anything.",
                })
              : Blocks.Section({
                  text: `We could not find an Acapela user for you. Make sure ${createSlackLink(
                    process.env.FRONTEND_URL + routes.settings,
                    "to link your Slack account in your Acapela team settings"
                  )} so that you can vote on decisions through Slack.`,
                })
          )
          .buildToObject(),
      });
      return;
    }

    await db.$transaction(async (db) => {
      await db.decision_vote.deleteMany({
        where: { user_id: user.id, decision_option: { message_id: decisionOption.message_id } },
      });
      if (decisionOption.decision_vote.length == 0) {
        await db.decision_vote.create({
          data: {
            user_id: user.id,
            decision_option_id: decisionOption.id,
          },
        });
      }
    });
    await db.task.updateMany({
      where: { user_id: user.id, message_id: decisionOption.message_id },
      data: {
        done_at:
          (await db.decision_vote.count({
            where: { user_id: user.id, decision_option: { message_id: decisionOption.message_id } },
          })) == 0
            ? null
            : new Date().toISOString(),
      },
    });
  });
}

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

type TopicWithToken = Topic & { topic_access_token?: TopicAccessToken[] };

const EMOJI_NUMBERS = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
const emojifyNumber = (n: number) =>
  n
    .toString()
    .split("")
    .map((n) => EMOJI_NUMBERS[parseInt(n)])
    .join("");

const DecisionVotes = (
  options: (DecisionOption & { decision_vote: (DecisionVote & { user: User })[] })[],
  slackUsers: Record<string, string>
) =>
  options.map(({ id, option, index, decision_vote }) => {
    const emojiNo = emojifyNumber(index + 1);
    return Blocks.Section({
      text:
        emojiNo +
        " " +
        option +
        (decision_vote.length == 0
          ? ""
          : " " +
            Md.codeInline(String(decision_vote.length)) +
            "\n" +
            decision_vote
              .map(({ user }) => (slackUsers[user.id] ? Md.user(slackUsers[user.id]) : Md.italic(user.name)))
              .join(" ")),
    }).accessory(Elements.Button({ text: emojiNo, actionId: DECISION_VOTE_ACTION_ID, value: id }));
  });

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
        : [...DecisionVotes(message.decision_option, slackUsers), Blocks.Divider()],
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
