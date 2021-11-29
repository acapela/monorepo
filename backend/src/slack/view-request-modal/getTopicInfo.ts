import { db } from "~db";
import { RichEditorNode } from "~richEditor/content/types";
import { assert } from "~shared/assert";
import { routes } from "~shared/routes";
import { RequestType } from "~shared/types/mention";

import { slackClient } from "../app";
import { GenerateContext, generateMarkdownFromTipTapJson } from "../md/generator";
import { SlackMember, TopicInfo } from "./types";

export async function getViewRequestViewModel(token: string, topicId: string, slackUserId: string) {
  const team = await db.team.findFirst({
    where: {
      topic: {
        some: {
          id: topicId,
        },
      },
    },
    select: {
      id: true,
    },
  });

  assert(team, "not team exists");

  const topic = await db.topic.findFirst({
    where: { id: topicId },
    include: {
      topic_member: {
        include: {
          user: {
            include: {
              team_member: {
                include: {
                  team_member_slack: true,
                },
                where: {
                  team_id: team.id,
                },
              },
            },
          },
        },
      },
      message: {
        orderBy: {
          created_at: "asc",
        },
        include: {
          message_task_due_date: true,
          task: true,
        },
      },
      topic_slack_message: true,
    },
  });

  assert(topic, "topic not found");

  function toSlackTeamMember(userId: string): SlackMember {
    const userWithTeamAndSlackMember = topic?.topic_member.find((tm) => tm.user_id === userId)?.user;

    assert(userWithTeamAndSlackMember, "user not found");

    return {
      name: userWithTeamAndSlackMember.name,
      userId: userId,
      slackUserId: userWithTeamAndSlackMember.team_member[0].team_member_slack?.slack_user_id,
    };
  }

  const mentionedSlackIdByUsersId = Object.assign(
    {},
    ...topic.topic_member.map((tm) => ({
      [tm.user_id]: {
        name: tm.user.name,
        slackId: tm.user.team_member[0].team_member_slack?.slack_user_id,
      },
    }))
  );

  const generatorContext: GenerateContext = {
    mentionedSlackIdByUsersId,
  };

  const slackMessagePermalink = topic.topic_slack_message
    ? (
        await slackClient.chat.getPermalink({
          channel: topic.topic_slack_message.slack_channel_id,
          message_ts: topic.topic_slack_message.slack_message_ts,
          token,
        })
      ).permalink
    : undefined;

  const topicInfo: TopicInfo = {
    id: topic.id,
    url: `${process.env.FRONTEND_URL}${routes.topic({ topicSlug: topic.slug })}`,
    name: topic.name,
    isClosed: !!topic.closed_at,
    slackUserId,
    slackMessagePermalink,
    messages: topic.message.map((m) => ({
      message: {
        id: m.id,
        content: generateMarkdownFromTipTapJson(m.content as RichEditorNode, generatorContext),
        createdAt: new Date(m.created_at),
        fromUser: toSlackTeamMember(m.user_id),
        fromUserImage: topic.topic_member.find((tm) => tm.user_id === m.user_id)?.user.avatar_url ?? undefined,
      },
      dueDate: m.message_task_due_date ? new Date(m.message_task_due_date.due_at) : undefined,
      tasks: m.task.map((t) => ({
        id: t.id,
        user: toSlackTeamMember(t.user_id),
        type: t.type as RequestType,
        doneAt: t.done_at ? new Date(t.done_at) : undefined,
      })),
    })),
  };

  return topicInfo;
}
