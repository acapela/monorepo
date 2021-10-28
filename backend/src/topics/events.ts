import { Topic, db } from "~db";
import { assert } from "~shared/assert";
import { routes } from "~shared/routes";

import { HasuraEvent } from "../hasura";
import { createClosureNotificationMessage } from "../notifications/bodyBuilders/topicClosed";
import { sendNotificationPerPreference } from "../notifications/sendNotification";

export async function handleTopicUpdates(event: HasuraEvent<Topic>) {
  const topicId = event.item.id;
  const topic = await db.topic.findUnique({ where: { id: topicId } });
  assert(topic, `Topic id (id=${topicId}) provided by event was not found`);

  if (event.type === "update") {
    notifyTopicUpdates(event, topic);
  }
}

function notifyTopicUpdates(event: HasuraEvent<Topic>, topic: Topic) {
  const ownerId = topic.owner_id;
  const userIdThatClosedTopic = topic.closed_by_user_id;

  const isClosedByOwner = ownerId === userIdThatClosedTopic;
  const wasJustClosed = topic.closed_at && !event?.itemBefore?.closed_at;

  if (wasJustClosed && !isClosedByOwner) {
    notifyOwnerOfTopicClosure(ownerId, userIdThatClosedTopic as string, topic);
  }
}

async function notifyOwnerOfTopicClosure(ownerId: string, userIdThatClosedTopic: string, topic: Topic) {
  const topicOwner = await db.user.findFirst({ where: { id: ownerId } });
  const topicCloser = userIdThatClosedTopic
    ? await db.user.findFirst({ where: { id: userIdThatClosedTopic as string } })
    : null;

  assert(topicOwner, `[Closing Topic][id=${topic.id}] Owner ${ownerId} not found.`);

  const topicURL = `${process.env.FRONTEND_URL}${routes.topic({ topicSlug: topic.slug })}`;

  const topicName = topic.name;

  sendNotificationPerPreference(
    topicOwner,
    topic.team_id,
    createClosureNotificationMessage({
      closedBy: topicCloser?.name,
      topicId: topic.id,
      topicName,
      topicURL,
    })
  );
}
