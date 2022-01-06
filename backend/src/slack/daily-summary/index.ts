import { addDays } from "date-fns";

import { db } from "~db";

import { slackClient } from "../app";
import { DailySummaryMessage } from "./DailySummaryMessage";
import { TeamMemberWithSlack, TopicVM } from "./types";

export async function trySendDailySummary(teamMember: TeamMemberWithSlack, token?: string | null) {
  const slackUserId = teamMember.team_member_slack.slack_user_id;
  if (!token || !slackUserId) {
    return;
  }

  const topicsDueToday = await getTopicsDueToday(teamMember.user_id, teamMember.team_id);
  const otherReceivedTopics = await getReceivedTopics(
    teamMember.user_id,
    teamMember.team_id,
    topicsDueToday.map((t) => t.id)
  );

  const notificationsSentOutsideOfWorkHours = await getNotificationsSentOutsideOfWorkHours(
    teamMember.user_id,
    teamMember.team_member_slack.id
  );

  if (topicsDueToday.length + otherReceivedTopics.length + notificationsSentOutsideOfWorkHours.length === 0) {
    return;
  }

  const summaryMessage = DailySummaryMessage({
    topicsDueToday,
    otherReceivedTopics,
    notificationsSentOutsideOfWorkHours,
  });

  await slackClient.chat.postMessage({
    token,
    channel: slackUserId,
    text: "Your Daily Summary :sunny:",
    blocks: summaryMessage.blocks,
  });

  cleanupNotificationQueue(teamMember.team_member_slack.id);
}

async function getTopicsDueToday(userId: string, teamId: string): Promise<TopicVM[]> {
  const now = new Date();
  const aDayFromNow = addDays(now, 1);

  return await db.topic.findMany({
    select: {
      id: true,
      name: true,
      message: {
        select: {
          message_task_due_date: true,
        },
        where: {
          AND: {
            task: {
              some: {
                done_at: null,
                user_id: userId,
              },
            },
            message_task_due_date: {
              due_at: {
                lte: aDayFromNow,
              },
            },
          },
        },
      },
    },

    where: {
      AND: {
        closed_at: {
          equals: null,
        },

        team_id: teamId,

        topic_member: {
          some: {
            user_id: userId,
          },
        },

        message: {
          some: {
            AND: {
              task: {
                some: {
                  done_at: null,
                  user_id: userId,
                },
              },
              message_task_due_date: {
                due_at: {
                  lte: aDayFromNow,
                },
              },
            },
          },
        },
      },
    },
  });
}

async function getReceivedTopics(userId: string, teamId: string, excludedTopics: string[]) {
  return await db.topic.findMany({
    select: {
      id: true,
      name: true,
      user: true,
      message: {
        select: {
          message_task_due_date: true,
        },
        where: {
          AND: {
            task: {
              some: {
                done_at: null,
                user_id: userId,
              },
            },
            NOT: {
              message_task_due_date: null,
            },
          },
        },
      },
    },
    where: {
      AND: {
        id: {
          notIn: excludedTopics,
        },
        team_id: teamId,
        closed_at: null,

        message: {
          some: {
            AND: {
              task: {
                some: {
                  done_at: null,
                  user_id: userId,
                },
              },
            },
          },
        },
      },
    },
  });
}

async function getNotificationsSentOutsideOfWorkHours(userId: string, teamMemberSlackId: string) {
  return await db.slack_notification_queue.findMany({
    where: {
      team_member_slack_id: teamMemberSlackId,
      topic: {
        closed_at: { equals: null },
        OR: [{ owner_id: userId }, { message: { some: { task: { some: { done_at: null, user_id: userId } } } } }],
      },
    },
  });
}

async function cleanupNotificationQueue(teamMemberSlackId: string) {
  return await db.slack_notification_queue.deleteMany({
    where: {
      team_member_slack_id: teamMemberSlackId,
    },
  });
}
