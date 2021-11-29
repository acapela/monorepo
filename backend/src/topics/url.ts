import assert from "assert";

import { Topic, db } from "~db";
import { RichEditorNode } from "~richEditor/content/types";
import { routes } from "~shared/routes";
import { getTopicSlug } from "~shared/routes/topicSlug";

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
export async function backendGetTopicUrl(topic: Topic, hrefOnly = false) {
  const team = await db.team.findFirst({ where: { id: topic.id } });
  const firstMessage = await db.message.findFirst({ where: { topic_id: topic.id }, orderBy: { created_at: "asc" } });

  assert(team, `Cannot create topic url - no team with id ${topic.team_id}`);
  assert(firstMessage, `Cannot create topic url - no message for topic with id ${topic.id}`);

  const topicSlug = getTopicSlug(firstMessage.content as RichEditorNode, topic.name);

  const href = routes.topicByHandle({ teamSlug: team?.slug, topicSlug: topicSlug, topicId: topic.id });

  if (hrefOnly) return href;

  return `${process.env.FRONTEND_URL}${href}`;
}
