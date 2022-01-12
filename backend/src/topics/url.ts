import { Topic, db } from "@aca/db";
import { RichEditorNode } from "@aca/richEditor/content/types";
import { assert } from "@aca/shared/assert";
import { routes } from "@aca/shared/routes";
import { getTopicSlug } from "@aca/shared/routes/topicSlug";

/**
 * This is function used only for backend to create full topic url.
 *
 * This needs to fetch team for given topic from database (thus only usable on backend).
 *
 * It also is async due to fetching. On frontend we have entity which is able to resolve team relation in sync
 * way.
 *
 * To avoid confusion - I added backend prefix to make it explicit.
 */
export async function backendGetTopicUrl(topic: Topic, accessToken?: string) {
  const team = await db.team.findFirst({ where: { id: topic.team_id } });
  const firstMessage = await db.message.findFirst({ where: { topic_id: topic.id }, orderBy: { created_at: "asc" } });

  assert(team, `Cannot create topic url - no team with id ${topic.team_id}`);
  assert(firstMessage, `Cannot create topic url - no message for topic with id ${topic.id}`);

  const topicSlug = getTopicSlug(firstMessage.content as RichEditorNode, topic.name);

  const url = new URL(
    routes.topicByHandle({ teamSlug: team?.slug, topicSlug: topicSlug, topicId: topic.id }),
    process.env.FRONTEND_URL
  );

  if (accessToken) {
    url.searchParams.append("access_token", accessToken);
  }

  return url.toString();
}
