import type { JSONContent } from "@tiptap/core";

import { db } from "~db";
import { slugify } from "~shared/slugify";

import { ensureBotIsTeamMember } from "./botTeamMembership";
import { ensureBotUserExists } from "./botUser";

interface CreateTopicByBotInput {
  teamId: string;
  topicName: string;
  messageContent: JSONContent;
}

export async function createTopicByBot({ teamId, topicName }: CreateTopicByBotInput) {
  const bot = await ensureBotUserExists();
  await ensureBotIsTeamMember(teamId);

  const topicPromise = db.topic.create({
    data: {
      name: topicName,
      owner_id: bot.id,
      slug: await slugify(topicName),
      team_id: teamId,
      index: "0",
      message: {
        create: {
          user_id: bot.id,
          content: {},
          task: { create: {} },
        },
      },
    },
  });
}
