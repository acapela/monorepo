import { Prisma } from "@prisma/client";
import { App } from "@slack/bolt";
import { View } from "@slack/types";
import { flattenDeep, uniq } from "lodash";
import { Blocks, Elements, HomeTab, Md } from "slack-block-builder";

import { TeamMember, db } from "~db";
import { assertDefined } from "~shared/assert";
import { backendUserEventToJSON } from "~shared/backendAnalytics";
import { routes } from "~shared/routes";
import { pluralize } from "~shared/text/pluralize";

import { slackClient } from "../app";
import { GenerateContext } from "../md/generator";
import { createSlackLink } from "../md/utils";
import { SlackActionIds } from "../utils";
import { RequestItem } from "./RequestItem";
import { TopicRowsWithCount } from "./types";

const TOPICS_PER_CATEGORY = 10;

type TopicWhereInput = Prisma.topicWhereInput;

async function findAndCountTopics(
  { user_id, team_id }: TeamMember,
  where: TopicWhereInput
): Promise<TopicRowsWithCount> {
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
  const [rows, count] = await Promise.all([
    db.topic.findMany({
      where: globalWhere,
      orderBy: { created_at: "desc" },
      take: TOPICS_PER_CATEGORY,
      include: {
        user: true,
        message: {
          where: { task: { some: whereOpenUserTask } },
          include: {
            user: true,
            message_task_due_date: true,
            task: {
              where: whereOpenUserTask,
            },
          },
        },
        topic_member: true,
      },
    }),
    db.topic.count({ where: globalWhere }),
  ]);
  return { rows, count };
}

const Padding = [Blocks.Section({ text: " " }), Blocks.Section({ text: " " })];

const RequestsList = (title: string, topics: TopicRowsWithCount, context: GenerateContext) => {
  const extraRequestsCount = topics.count - topics.rows.length;
  return [
    ...Padding,
    Blocks.Header({ text: title }),
    ...(topics.count === 0
      ? [Blocks.Section({ text: Md.italic("No requests here") })]
      : topics.rows.flatMap((topic, i) => [
          ...RequestItem(topic, context),
          i < topics.rows.length - 1 ? Blocks.Divider() : undefined,
        ])),
    ...(extraRequestsCount > 0
      ? [
          Blocks.Divider(),
          Blocks.Section({
            text: Md.italic(
              `There ${pluralize(extraRequestsCount, "is another topic", "are more topics")} ${Md.bold(
                extraRequestsCount.toString()
              )} in this category. ${createSlackLink(process.env.FRONTEND_URL, "Open the web app")} to see ${pluralize(
                extraRequestsCount,
                "it",
                "them"
              )}.`
            ),
          }),
        ]
      : []),
  ];
};

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
      // Any message  that is created by user and with task(s) that are not done
      {
        message: {
          some: { user_id: currentUserId, task: { some: { done_at: null } } },
        },
      },
      {
        owner_id: { equals: currentUserId },
      },
    ],
  };

  const [received, sent, open, closed] = await Promise.all(
    (
      [
        { AND: [whereIsOpen, whereHasOpenTask] },
        { AND: [whereIsOpen, { NOT: whereHasOpenTask }, whereHasOpenSentTask] },
        { AND: [whereIsOpen, { NOT: [whereHasOpenTask, whereHasOpenSentTask] }] },
        { NOT: whereIsOpen },
      ] as TopicWhereInput[]
    ).map((where) => findAndCountTopics(teamMember, where))
  );

  const mentionedUserIds = uniq(
    flattenDeep([received, sent, open, closed].map((e) => e.rows.map((r) => r.topic_member.map((tm) => tm.user_id))))
  );

  const [teamMemberSlack, teamMemberTopic] = await Promise.all([
    db.team_member_slack.findMany({
      where: {
        team_member: {
          user_id: {
            in: mentionedUserIds,
          },
          team_id: teamMember.team_id,
        },
      },
      include: {
        team_member: true,
      },
    }),
    db.team_member.findMany({
      where: {
        user_id: {
          in: mentionedUserIds,
        },
        team_id: teamMember.team_id,
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

  const generatorContext: GenerateContext = {
    mentionedSlackIdByUsersId,
  };

  await publishView(
    HomeTab()
      .blocks(
        WelcomeHeader,
        Blocks.Section({
          text: `This is an overview of your tasks, you can find more details ${createSlackLink(
            process.env.FRONTEND_URL,
            "in the web app"
          )}.`,
        }),
        Blocks.Actions().elements(
          Elements.Button({ text: "+ New Request", actionId: SlackActionIds.CreateTopic }).primary(true),
          Elements.Button({ text: "Open web app" })
            .url(process.env.FRONTEND_URL)
            .actionId(SlackActionIds.TrackEvent)
            .value(backendUserEventToJSON(teamMember.user_id, "Opened Webapp From Slack Home Tab"))
        ),
        RequestsList("🔥 Received", received, generatorContext),
        RequestsList("📤 Sent", sent, generatorContext),
        RequestsList("⏳ Open", open, generatorContext),
        RequestsList("✅ Closed", closed, generatorContext)
      )
      .buildToObject()
  );
}

export function setupHomeTab(app: App) {
  app.event("app_home_opened", async ({ event, context }) => {
    await updateHomeView(assertDefined(context.botToken, "must have bot token"), event.user);
  });
}