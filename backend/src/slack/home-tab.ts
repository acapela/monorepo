import { Prisma } from "@prisma/client";
import { App } from "@slack/bolt";
import { View } from "@slack/types";
import { formatRelative } from "date-fns";
import { minBy } from "lodash";
import { Blocks, Elements, HomeTab, Md } from "slack-block-builder";

import { createSlackLink } from "~backend/src/notifications/sendNotification";
import { slackClient } from "~backend/src/slack/app";
import { generateMarkdownFromTipTapJson } from "~backend/src/slack/slackMarkdown/generator";
import { Message, MessageTaskDueDate, Task, TeamMember, Topic, User, db } from "~db";
import { RichEditorNode } from "~richEditor/content/types";
import { assertDefined } from "~shared/assert";
import { backendUserEventToJSON } from "~shared/backendAnalytics";
import { routes } from "~shared/routes";
import { pluralize } from "~shared/text/pluralize";
import { RequestType } from "~shared/types/mention";

import { REQUEST_TYPE_EMOJIS, SlackActionIds } from "./utils";

const TOPICS_PER_CATEGORY = 10;

type TopicWhereInput = Prisma.topicWhereInput;

type TopicWithOpenTask = Topic & {
  user: User;
  message: (Message & { user: User; task: Task[]; message_task_due_date: MessageTaskDueDate | null })[];
};

type TopicRowsWithCount = {
  rows: TopicWithOpenTask[];
  count: number;
};

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
      },
    }),
    db.topic.count({ where: globalWhere }),
  ]);
  return { rows, count };
}

function RequestItem(topic: TopicWithOpenTask) {
  // TODO this will need to be updated in the year 3k
  const mostUrgentMessage = minBy(
    topic.message,
    (message) => (message.task[0] && message.message_task_due_date?.due_at) ?? new Date(3000, 0)
  );
  const mostUrgentTask = mostUrgentMessage?.task[0];
  const mostUrgentDueDate = mostUrgentMessage?.message_task_due_date?.due_at;

  return [
    Blocks.Section({
      text: [
        createSlackLink(process.env.FRONTEND_URL + routes.topic({ topicSlug: topic.slug }), topic.name) +
          (mostUrgentDueDate ? " - " + Md.italic("due " + formatRelative(mostUrgentDueDate, new Date())) : ""),
        mostUrgentMessage?.content_text
          ? Md.bold(mostUrgentMessage.user.name + ":") +
            " " +
            generateMarkdownFromTipTapJson(mostUrgentMessage?.content as RichEditorNode)
          : "",
      ].join("\n"),
    }).accessory(
      mostUrgentTask
        ? Elements.Button({
            actionId: "toggle_task_done_at:" + mostUrgentTask.id,
            value: mostUrgentTask.id,
            text: `${REQUEST_TYPE_EMOJIS[mostUrgentTask.type as RequestType]} Mark as done`,
          })
        : undefined
    ),
  ];
}

const Padding = [Blocks.Section({ text: " " }), Blocks.Section({ text: " " })];

const RequestsList = (title: string, topics: TopicRowsWithCount) => {
  const extraRequestsCount = topics.count - topics.rows.length;
  return [
    ...Padding,
    Blocks.Header({ text: title }),
    ...(topics.count == 0
      ? [Blocks.Section({ text: Md.italic("No requests here") })]
      : topics.rows.flatMap((topic, i) => [
          ...RequestItem(topic),
          i < topics.rows.length - 1 ? Blocks.Divider() : undefined,
        ])),
    ...(extraRequestsCount > 0
      ? [
          Blocks.Divider(),
          Blocks.Section({
            text: Md.italic(
              `There ${pluralize(extraRequestsCount, "is", "are")} ${Md.bold(
                extraRequestsCount.toString()
              )} more ${pluralize(extraRequestsCount, "topic", "topics")} in this category. ${createSlackLink(
                process.env.FRONTEND_URL,
                "Open the web app"
              )} to see ${pluralize(extraRequestsCount, "it", "them")}.`
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

  const whereIsOpen: TopicWhereInput = { closed_at: null };
  const whereHasOpenTask: TopicWhereInput = {
    message: { some: { task: { some: { user_id: teamMember.user_id, done_at: null } } } },
  };
  const whereHasOpenSentTask: TopicWhereInput = {
    message: {
      some: { user_id: teamMember.user_id, task: { some: { user_id: { not: teamMember.user_id }, done_at: null } } },
    },
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
        RequestsList("🔥 Received", received),
        RequestsList("📤 Sent", sent),
        RequestsList("⏳ Open", open),
        RequestsList("✅ Closed", closed)
      )
      .buildToObject()
  );
}

export function setupHomeTab(app: App) {
  app.event("app_home_opened", async ({ event, context }) => {
    await updateHomeView(assertDefined(context.botToken, "must have bot token"), event.user);
  });
}
