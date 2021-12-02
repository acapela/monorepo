import type { JSONContent } from "@tiptap/core";

import { db } from "~db";
import { getUniqueRequestMentionDataFromContent } from "~shared/editor/mentions";
import { slugify } from "~shared/slugify";
import { getUUID } from "~shared/uuid";

import { ensureBotIsTeamMember } from "./botTeamMembership";
import { ensureBotUserExists } from "./botUser";

interface CreateTopicByBotInput {
  teamId: string;
  topicName: string;
  messageContent: JSONContent;
}

export async function createTopicByBot({ teamId, topicName, messageContent }: CreateTopicByBotInput) {
  const bot = await ensureBotUserExists();
  await ensureBotIsTeamMember(teamId);

  const topicId = getUUID();

  const topicPromise = db.topic.create({
    data: {
      id: topicId,
      name: topicName,
      owner_id: bot.id,
      slug: await slugify(topicName),
      team_id: teamId,
      index: "0",
    },
  });

  const messageId = getUUID();

  const messagePromise = db.message.create({
    data: {
      id: messageId,
      topic_id: topicId,
      type: "TEXT",
      user_id: bot.id,
      content: messageContent,
    },
  });

  const tasksInfo = getUniqueRequestMentionDataFromContent(messageContent);

  const tasksPromises = tasksInfo.map((taskInfo) => {
    return db.task.create({
      data: {
        message_id: messageId,
        user_id: taskInfo.userId,
        type: taskInfo.type,
      },
    });
  });

  const [topic, message, ...tasks] = await db.$transaction([topicPromise, messagePromise, ...tasksPromises]);

  return { topic, message, tasks };
}
