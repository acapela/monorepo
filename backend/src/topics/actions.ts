import { ActionHandler } from "~backend/src/actions/actionHandlers";
import { db } from "~db";
import { JoinTopicOutput } from "~gql";

export const joinTopicHandler: ActionHandler<{ access_token: string }, JoinTopicOutput> = {
  actionName: "join_topic",
  async handle(userId, { access_token }) {
    if (!userId) {
      return { success: false };
    }
    const topic = await db.topic.findFirst({
      where: {
        topic_access_token: { some: { token: access_token } },
        team: { team_member: { some: { user_id: userId } } },
      },
    });
    if (!topic) {
      return { success: false };
    }
    await db.topic_member.create({ data: { topic_id: topic.id, user_id: userId } });
    return { success: true };
  },
};
