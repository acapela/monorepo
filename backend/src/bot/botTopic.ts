import type { JSONContent } from "@tiptap/core";

import { Topic, db } from "~db";
import { getUniqueRequestMentionDataFromContent } from "~shared/editor/mentions";
import { slugify } from "~shared/slugify";

import { ensureBotIsTeamMember } from "./botTeamMembership";
import { ensureBotUserExists } from "./botUser";

interface CreateTopicByBotInput {
  teamId: string;
  topicName: string;
  messageContent: JSONContent;
  createdAt: Date;
  emojiReaction?: string;
}

export async function createTopicByBot({
  teamId,
  topicName,
  messageContent,
  createdAt,
  emojiReaction,
}: CreateTopicByBotInput) {
  const bot = await ensureBotUserExists();
  await ensureBotIsTeamMember(teamId);

  const tasksInfo = getUniqueRequestMentionDataFromContent(messageContent);

  const topicWithDetails = await db.topic.create({
    data: {
      name: topicName,
      owner_id: bot.id,
      slug: await slugify(topicName),
      team_id: teamId,
      index: "0",
      created_at: createdAt,
      message: {
        create: {
          type: "TEXT",
          user_id: bot.id,
          content: messageContent,
          message_reaction: emojiReaction ? { create: { user_id: bot.id, emoji: emojiReaction } } : undefined,
          task: {
            createMany: {
              data: tasksInfo.map((taskInfo) => ({
                user_id: taskInfo.userId,
                type: taskInfo.type,
              })),
            },
          },
        },
      },
    },
    include: { message: { include: { task: true } } },
  });

  const topic = topicWithDetails as Topic;

  const message = topicWithDetails.message[0];

  const tasks = message.task;

  return { topic, message, tasks };
}
