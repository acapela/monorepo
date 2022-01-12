import { Prisma } from "@prisma/client";
import { orderBy, partition, sumBy } from "lodash";
import { Blocks, Elements, HomeTab, Md } from "slack-block-builder";

import { db } from "@aca/db";
import { backendUserEventToJSON } from "@aca/shared/backendAnalytics";
import { isNotFalsy } from "@aca/shared/nullish";
import { routes } from "@aca/shared/routes";
import { pluralize } from "@aca/shared/text/pluralize";

import { createSlackLink } from "../md/utils";
import { SlackActionIds, isRequestDueSoon, isRequestUnread } from "../utils";
import { RequestListParams, RequestsList } from "./RequestList";
import { TopicWithOpenTask, UnreadMessage } from "./types";
import { Padding, getMostUrgentMessage } from "./utils";

type TopicWhereInput = Prisma.topicWhereInput;

async function findAndCountTopics(
  userId: string,
  teamId: string,
  where: TopicWhereInput
): Promise<TopicWithOpenTask[]> {
  const globalWhere: TopicWhereInput = {
    AND: [
      {
        archived_at: null,
        team_id: teamId,
        OR: [{ owner_id: userId }, { topic_member: { some: { user_id: userId } } }],
      },
      where,
    ],
  };
  const whereOpenUserTask: Prisma.taskWhereInput = { user_id: userId, done_at: null };
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

export const missingAuthSlackBlocks = [
  WelcomeHeader,
  Blocks.Section({
    text: `To use Acapela from Slack please link the two over in ${createSlackLink(
      process.env.FRONTEND_URL + routes.settings,
      "your Acapela settings"
    )}.`,
  }),
];

export const MissingAuthHomeTab = HomeTab()
  .blocks(...missingAuthSlackBlocks)
  .buildToObject();

/*
 This arbitrary number is estimated based on Slack's 100 max block limit, minus the 4 header blocks, so 96 left.
 RequestList needs up to 7 blocks and then 2 (+ 1 Divider) blocks per RequestItem in it.
 So if we show all our 5 categories that gives us: 96 - 5 * 7 = 61 blocks left
 For a total number of 61 / 3 = 20 topics
 And then to make sure it renders and there's some slack (pardon the pun) in the system 20 * 90% = 18
*/
const MAX_TOTAL_TOPICS = 18;

interface SummaryBuilderInput {
  includeWelcome?: boolean;
}

export async function buildSummaryBlocksForSlackUser(slackUserId: string, params: SummaryBuilderInput) {
  const teamMember = await db.team_member.findFirst({ where: { team_member_slack: { slack_user_id: slackUserId } } });
  if (!teamMember) {
    return null;
  }

  const currentUserId = teamMember.user_id;

  return buildSummaryBlocksForUser(currentUserId, params, teamMember.team_id);
}

/**
 * Will build multiple RequestsList, but keeping 'global' max visible topics limit.
 */
async function buildSummaryListsBlocks(requestListsParams: RequestListParams[]) {
  // We share slots between all lists
  let freeSlotsLeft = MAX_TOTAL_TOPICS;
  // Category that will not make it in under limit will be added here
  const hiddenCategories: string[] = [];

  // Flat list of all blocks for all lists
  const summaryListsBlocks: Awaited<ReturnType<typeof RequestsList>> = [];

  // Note - we don't use Promise.all as we need to execute it in order so less important lists will not take free slots first.
  for (const listParams of requestListsParams) {
    const topicCount = listParams.topics.length;

    if (topicCount === 0) continue;

    if (!freeSlotsLeft) {
      hiddenCategories.push(`${listParams.title} (${Md.bold(String(topicCount))})`);
      continue;
    }

    const listBlocks = await RequestsList({ ...listParams, maxShownTopics: freeSlotsLeft });

    summaryListsBlocks.push(...listBlocks);

    freeSlotsLeft = Math.max(freeSlotsLeft - topicCount, 0);
  }

  return { summaryListsBlocks, hiddenCategories };
}

function isTopicAHighlight(topic: TopicWithOpenTask, currentUserId: string) {
  const mostUrgentMessage = getMostUrgentMessage(topic.message);
  return (
    mostUrgentMessage &&
    (isRequestUnread(mostUrgentMessage.task, currentUserId) ||
      isRequestDueSoon(mostUrgentMessage.message_task_due_date))
  );
}

export async function buildSummaryBlocksForUser(
  currentUserId: string,
  { includeWelcome }: SummaryBuilderInput,
  inputTeamId?: string
) {
  if (!inputTeamId) {
    const user = await db.user.findFirst({ where: { id: currentUserId } });

    if (!user || !user.current_team_id) {
      return null;
    }

    inputTeamId = user.current_team_id;
  }

  const teamId = inputTeamId;

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
    ).map((where) => findAndCountTopics(currentUserId, teamId, where))
  );

  // Sort, so items with due date are first
  const allReceived = orderBy(
    unsortedReceived,
    (topic) => getMostUrgentMessage(topic.message)?.message_task_due_date?.due_at
  );

  const unreadMessagesByTopic: UnreadMessage[] =
    await db.$queryRaw`SELECT topic_id, unread_messages FROM unread_messages WHERE user_id=${currentUserId} AND team_id=${inputTeamId};`;

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

  const [highlights, received] = partition(allReceived, (topic) => isTopicAHighlight(topic, currentUserId));

  const requestListsParams: RequestListParams[] = [
    highlights.length > 0 && {
      title: "Highlights",
      explainer: "Requests assigned to you that deserve special attention",
      currentUserId,
      topics: highlights,
      unreadMessagesByTopicId,
      showHighlightContext: true,
    },
    received.length > 0 && {
      title: "Received",
      explainer: "Requests assigned to you",
      currentUserId,
      topics: received,
      unreadMessagesByTopicId,
      emptyText: "You are all caught up 🎉",
    },
    {
      title: "Sent",
      explainer: "Requests you've sent to others",
      currentUserId,
      topics: sent,
      unreadMessagesByTopicId,
    },
  ].filter(isNotFalsy);

  const { hiddenCategories, summaryListsBlocks } = await buildSummaryListsBlocks(requestListsParams);

  const inTheWebAppLink = createSlackLink(process.env.FRONTEND_URL, "in the Acapela web app");

  return [
    includeWelcome ? WelcomeHeader : null,
    Blocks.Section({ text: allUnreadMessagesText }),
    Padding,
    Blocks.Divider(),
    Padding,
    Padding,
    ...summaryListsBlocks,
    hiddenCategories.length > 0 &&
      Blocks.Context().elements(
        `There are more topics for these categories ${inTheWebAppLink}:\n${Md.listBullet(hiddenCategories)}`
      ),
    Blocks.Divider(),
    Padding,
    Blocks.Actions().elements(
      Elements.Button({ text: "+ New Request", actionId: SlackActionIds.CreateTopic }).primary(true),
      Elements.Button({ text: "Open web app" })
        .url(process.env.FRONTEND_URL)
        .actionId(SlackActionIds.TrackEvent)
        .value(backendUserEventToJSON(currentUserId, "Opened Webapp From Slack Home Tab"))
    ),
  ].filter(isNotFalsy);
}
