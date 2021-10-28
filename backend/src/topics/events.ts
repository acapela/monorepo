import { Topic, db } from "~db";
import { assert } from "~shared/assert";
import { routes } from "~shared/routes";
import { TopicEventTypes } from "~shared/types/topicEvents";

import { HasuraEvent } from "../hasura";
import { createClosureNotificationMessage } from "../notifications/bodyBuilders/topicClosed";
import { sendNotificationPerPreference } from "../notifications/sendNotification";

export async function handleTopicUpdates(event: HasuraEvent<Topic>) {
  const topicId = event.item.id;
  const topic = await db.topic.findUnique({ where: { id: topicId } });
  assert(topic, `Topic id (id=${topicId}) provided by event was not found`);

  if (event.type === "update") {
    notifyTopicUpdates(event, topic);
    updateTopicEvents(event);
  }
}

async function updateTopicEvents(event: HasuraEvent<Topic>) {
  const topicNow = event.item;
  const topicBefore = event.itemBefore;

  // Should never be null on event updates
  assert(topicBefore, "Updated topic didn't contain previous topic data");

  const isOpen = (topic: Topic) => topic.closed_at === null;
  const isArchived = (topic: Topic) => topic.archived_at !== null;

  const wasJustClosed = !isOpen(topicNow) && isOpen(topicBefore);
  if (wasJustClosed) {
    await db.topic_event.create({
      data: {
        topic_id: topicNow.id,
        type: TopicEventTypes.TopicClosed,
        topic_event_topic_closed: {
          create: {
            closed_by_user_id: event.userId,
          },
        },
      },
    });
  }

  const wasJustReopened = isOpen(topicNow) && !isOpen(topicBefore);
  if (wasJustReopened) {
    await db.topic_event.create({
      data: {
        topic_id: topicNow.id,
        type: TopicEventTypes.TopicReopened,
        topic_event_topic_reopened: {
          create: {
            reopened_by_user_id: event.userId,
          },
        },
      },
    });
  }

  const wasJustArchived = isArchived(topicNow) && !isArchived(topicBefore);
  if (wasJustArchived) {
    await db.topic_event.create({
      data: {
        topic_id: topicNow.id,
        type: TopicEventTypes.TopicArchived,
        topic_event_topic_archived: {
          create: {
            archived_by_user_id: event.userId,
          },
        },
      },
    });
  }

  const wasJustUnarchived = !isArchived(topicNow) && isArchived(topicBefore);
  if (wasJustUnarchived) {
    await db.topic_event.create({
      data: {
        topic_id: topicNow.id,
        type: TopicEventTypes.TopicUnarchived,
        topic_event_topic_unarchived: {
          create: {
            unarchived_by_user_id: event.userId,
          },
        },
      },
    });
  }
}

function notifyTopicUpdates(event: HasuraEvent<Topic>, topic: Topic) {
  const ownerId = topic.owner_id;
  const userIdThatClosedTopic = topic.closed_by_user_id;

  const isClosedByOwner = ownerId === userIdThatClosedTopic;
  const wasJustClosed = topic.closed_at && event?.itemBefore?.closed_at === null;

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
