import { Prisma } from "@prisma/client";
import { App } from "@slack/bolt";
import { View } from "@slack/types";
import { formatRelative } from "date-fns";
import { sortBy } from "lodash";
import { Blocks, Elements, HomeTab, Md } from "slack-block-builder";

import { createSlackLink } from "~backend/src/notifications/sendNotification";
import { slackClient } from "~backend/src/slack/app";
import { Message, Task, Topic, User, db } from "~db";
import { assertDefined } from "~shared/assert";
import { routes } from "~shared/routes";
import { pluralize } from "~shared/text/pluralize";
import { RequestType } from "~shared/types/mention";

import { REQUEST_TYPE_EMOJIS, SlackActionIds, findUserBySlackId } from "./utils";

const TOPICS_PER_CATEGORY = 10;

type TopicWhereInput = Prisma.topicWhereInput;

type TopicWithUserAndOpenTask = Topic & { user: User; message: (Message & { task: Task[] })[] };
type TopicRowsWithCount = {
  rows: TopicWithUserAndOpenTask[];
  count: number;
};

async function findAndCountTopics(
  userId: string,
  args: Prisma.topicFindManyArgs & { where: TopicWhereInput }
): Promise<TopicRowsWithCount> {
  const where: TopicWhereInput = {
    AND: [
      { archived_at: null, OR: [{ owner_id: userId }, { topic_member: { some: { user_id: userId } } }] },
      args.where,
    ],
  };

  const [rows, count] = await Promise.all([
    db.topic.findMany({
      ...args,
      where,
      take: TOPICS_PER_CATEGORY,
      include: { user: true, message: { include: { task: { where: { user_id: userId, done_at: null } } } } },
    }),
    db.topic.count({ where }),
  ]);
  return { rows, count };
}

function RequestItem(topic: TopicWithUserAndOpenTask) {
  const [mostUrgentTask] = sortBy(
    topic.message.flatMap((message) => message.task.flatMap((task) => task)),
    (task) => task.due_at
  );
  return [
    Blocks.Section({
      text:
        createSlackLink(process.env.FRONTEND_URL + routes.topic({ topicSlug: topic.slug }), topic.name) +
        (mostUrgentTask?.due_at ? "\n" + Md.italic("Due " + formatRelative(mostUrgentTask.due_at, new Date())) : ""),
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

const RequestsList = (title: string, topics: TopicRowsWithCount) => {
  const extraRequestsCount = topics.count - topics.rows.length;
  return [
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
      )}`,
    })
  )
  .buildToObject();

export async function updateHomeView(botToken: string, slackUserId: string) {
  const publishView = (view: View) => slackClient.views.publish({ token: botToken, user_id: slackUserId, view });

  const user = await findUserBySlackId(botToken, slackUserId);
  if (!user) {
    await publishView(MissingAuthHomeTab);
    return;
  }

  const whereIsOpen: TopicWhereInput = { closed_at: null };
  const whereHasOpenTask: TopicWhereInput = {
    message: { some: { task: { some: { user_id: user.id, done_at: null } } } },
  };
  const whereHasOpenSentTask: TopicWhereInput = {
    message: { some: { user_id: user.id, task: { some: { user_id: { not: user.id }, done_at: null } } } },
  };
  const [received, sent, open, closed] = await Promise.all([
    findAndCountTopics(user.id, {
      where: { AND: [whereIsOpen, whereHasOpenTask] },
      orderBy: { created_at: "desc" },
    }),
    findAndCountTopics(user.id, {
      where: { AND: [whereIsOpen, { NOT: whereHasOpenTask }, whereHasOpenSentTask] },
      orderBy: { created_at: "desc" },
    }),
    findAndCountTopics(user.id, {
      where: { AND: [whereIsOpen, { NOT: [whereHasOpenTask, whereHasOpenSentTask] }] },
      orderBy: { created_at: "desc" },
    }),
    findAndCountTopics(user.id, {
      where: { NOT: whereIsOpen },
      orderBy: { created_at: "desc" },
    }),
  ]);

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
          Elements.Button({ text: "Open web app" }).url(process.env.FRONTEND_URL)
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
