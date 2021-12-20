import { Prisma } from "@prisma/client";
import { App } from "@slack/bolt";
import { View } from "@slack/types";
import { differenceInHours } from "date-fns";
import { orderBy, partition, sumBy } from "lodash";
import { Blocks, Elements, HomeTab, Md } from "slack-block-builder";

import { TeamMember, db } from "~db";
import { assertDefined } from "~shared/assert";
import { backendUserEventToJSON } from "~shared/backendAnalytics";
import { isNotNullish } from "~shared/nullish";
import { routes } from "~shared/routes";
import { pluralize } from "~shared/text/pluralize";

import { slackClient } from "../app";
import { createSlackLink } from "../md/utils";
import { SlackActionIds } from "../utils";
import { RequestListParams, RequestsList } from "./RequestList";
import { TopicWithOpenTask, UnreadMessage } from "./types";
import { getMostUrgentMessage } from "./utils";

type TopicWhereInput = Prisma.topicWhereInput;

async function findAndCountTopics(
  { user_id, team_id }: TeamMember,
  where: TopicWhereInput
): Promise<TopicWithOpenTask[]> {
  const globalWhere: TopicWhereInput = {
    AND: [
      {
        archived_at: null,
        team_id,
        OR: [{ owner_id: user_id }, { topic_member: { some: { user_id } } }],
      },
      where,
    ],
  };
  const whereOpenUserTask: Prisma.taskWhereInput = { user_id, done_at: null };
  return await db.topic.findMany({
    where: globalWhere,
    orderBy: { created_at: "desc" },
    include: {
      user: true,
      message: {
        where: { task: { some: whereOpenUserTask } },
        include: { user: true, message_task_due_date: true, task: true },
      },
      topic_member: true,
    },
  });
}

const WelcomeHeader = Blocks.Header({ text: "Welcome to Acapela!" });

const MissingAuthHomeTab = HomeTab()
  .blocks(
    WelcomeHeader,
    Blocks.Section({
      text: `To use Acapela from Slack please link the two over in ${createSlackLink(
        process.env.FRONTEND_URL + routes.settings,
        "your Acapela settings"
      )}.`,
    })
  )
  .buildToObject();

/*
 This arbitrary number is estimated based on Slack's 100 max block limit, minus the 4 header blocks, so 96 left.
 RequestList needs up to 5 blocks and then 3 blocks per RequestItem in it.
 So if we show all our 5 categories that gives us: 96 - 5 * 3 = 81 blocks left
 For a total number of 81 / 5 = 16 topics
 And then to make sure it renders and there's some slack (pardon the pun) in the system 16 - 2 = 14
*/
const MAX_TOTAL_TOPICS = 14;

export async function updateHomeView(botToken: string, slackUserId: string) {
  const publishView = (view: View) => slackClient.views.publish({ token: botToken, user_id: slackUserId, view });

  const teamMember = await db.team_member.findFirst({ where: { team_member_slack: { slack_user_id: slackUserId } } });
  if (!teamMember) {
    await publishView(MissingAuthHomeTab);
    return;
  }

  const currentUserId = teamMember.user_id;

  const whereIsOpen: TopicWhereInput = { closed_at: null };

  const whereHasOpenTask: TopicWhereInput = {
    // Any message with task(s) assigned to user and not done
    message: { some: { task: { some: { user_id: currentUserId, done_at: null } } } },
  };

  const whereHasOpenSentTask: TopicWhereInput = {
    OR: [
      // Any message that is created by user and with task(s) for other people that are not done
      {
        message: {
          some: {
            user_id: currentUserId,
            task: {
              some: {
                done_at: null,
                user_id: { not: currentUserId },
              },
            },
          },
        },
      },
      {
        owner_id: { equals: currentUserId },
      },
    ],
  };

  const [unsortedReceived, sent] = await Promise.all(
    (
      [
        { AND: [whereIsOpen, whereHasOpenTask] },
        { AND: [whereIsOpen, { NOT: whereHasOpenTask }, whereHasOpenSentTask] },
      ] as TopicWhereInput[]
    ).map((where) => findAndCountTopics(teamMember, where))
  );

  const allReceived = orderBy(unsortedReceived, (topic) => getMostUrgentMessage(topic)?.message_task_due_date?.due_at);

  const unreadMessagesByTopic: UnreadMessage[] =
    await db.$queryRaw`SELECT topic_id, unread_messages FROM unread_messages WHERE user_id=${teamMember.user_id} AND team_id=${teamMember.team_id};`;

  const allUnreadMessages: number = sumBy(unreadMessagesByTopic, "unread_messages");
  const allUnreadMessagesText = allUnreadMessages
    ? `:envelope_with_arrow: You currently have *${allUnreadMessages}* unread ${pluralize(
        allUnreadMessages,
        "message",
        "messages"
      )}.`
    : ":envelope: You're all caught up. :tada:";

  const unreadMessagesByTopicId = Object.fromEntries(
    unreadMessagesByTopic.map((um) => [um.topic_id, um.unread_messages])
  );

  const [highlights, received] = partition(allReceived, (topic) => {
    const mostUrgentMessage = getMostUrgentMessage(topic);
    if (!mostUrgentMessage) {
      return false;
    }
    const userTask = mostUrgentMessage.task.find((task) => task.user_id == currentUserId);
    const dueAt = mostUrgentMessage.message_task_due_date?.due_at;
    topic.isUnread = userTask && !userTask.seen_at;
    topic.isDueSoon = dueAt && differenceInHours(dueAt, new Date()) <= 24;
    return topic.isUnread || topic.isDueSoon;
  });

  const requestListsParams: RequestListParams[] = [
    highlights.length == 0
      ? null
      : {
          title: "✨️ Highlights",
          explainer: "Requests assigned to you that deserve special attention",
          currentUserId,
          topics: highlights,
          unreadMessagesByTopicId,
          showHighlightContext: true,
        },
    highlights.length > 0 && received.length == 0
      ? null
      : {
          title: "⁉️ Received",
          explainer: "Requests assigned to you",
          currentUserId,
          topics: received,
          unreadMessagesByTopicId,
          emptyText: "You are all caught up 🎉",
        },
    {
      title: "📤 Sent",
      explainer: "Requests you've sent to others",
      currentUserId,
      topics: sent,
      unreadMessagesByTopicId,
    },
  ].filter(isNotNullish);
  const { listPromises, hiddenCategories } = requestListsParams.reduce<{
    listPromises: ReturnType<typeof RequestsList>[];
    freeSlots: number;
    hiddenCategories: string[];
  }>(
    ({ listPromises, freeSlots, hiddenCategories }, listParams) => {
      const topicCount = listParams.topics.length;
      if (freeSlots > 0 || topicCount == 0) {
        listPromises = listPromises.concat(RequestsList({ ...listParams, maxShownTopics: freeSlots }));
        freeSlots = Math.max(freeSlots - topicCount, 0);
      } else {
        hiddenCategories = hiddenCategories.concat(`${listParams.title} (${Md.bold(String(topicCount))})`);
      }
      return { listPromises, freeSlots, hiddenCategories };
    },
    { listPromises: [], freeSlots: MAX_TOTAL_TOPICS, hiddenCategories: [] }
  );

  const inTheWebAppLink = createSlackLink(process.env.FRONTEND_URL, "in the Acapela web app");
  await publishView(
    HomeTab()
      .blocks(
        WelcomeHeader,
        Blocks.Section({
          text: `This is an overview of all your tasks. You can find more details ${inTheWebAppLink}.`,
        }),
        Blocks.Section({ text: allUnreadMessagesText }),
        Blocks.Actions().elements(
          Elements.Button({ text: "+ New Request", actionId: SlackActionIds.CreateTopic }).primary(true),
          Elements.Button({ text: "Open web app" })
            .url(process.env.FRONTEND_URL)
            .actionId(SlackActionIds.TrackEvent)
            .value(backendUserEventToJSON(teamMember.user_id, "Opened Webapp From Slack Home Tab"))
        ),
        ...(await Promise.all(listPromises)),
        hiddenCategories.length == 0
          ? undefined
          : Blocks.Context().elements(
              `There are more topics for these categories ${inTheWebAppLink}:\n${Md.listBullet(hiddenCategories)}`
            )
      )
      .buildToObject()
  );
}

export function setupHomeTab(app: App) {
  app.event("app_home_opened", async ({ event, context }) => {
    await updateHomeView(assertDefined(context.botToken, "must have bot token"), event.user);
  });
}
