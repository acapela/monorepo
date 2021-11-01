import { Topic, db } from "~db";
import { assert } from "~shared/assert";
import { trackBackendUserEvent } from "~shared/backendAnalytics";
import { routes } from "~shared/routes";

import { HasuraEvent } from "../hasura";
import { createClosureNotificationMessage } from "../notifications/bodyBuilders/topicClosed";
import { sendNotificationPerPreference } from "../notifications/sendNotification";

export async function handleTopicUpdates(event: HasuraEvent<Topic>) {
  const topicId = event.item.id;
  const topic = await db.topic.findUnique({ where: { id: topicId } });
  assert(topic, `Topic id (id=${topicId}) provided by event was not found`);

  if (event.type === "create") {
    // This is a test event that will duplicate all the other create topic events.
    // If the sum of all other origins don't add up to "unknown", then this is a hint to the issue
    // https://linear.app/acapela/issue/ACA-862/research-if-our-analitycs-is-blocked-validate-privacy-blockers
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    trackBackendUserEvent(event.userId!, "Created Topic", { origin: "unknown", topicName: event.item.name });
  }

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

  const isOpenStatusChanged = topicNow.closed_at !== topicBefore.closed_at;
  if (isOpenStatusChanged) {
    await db.topic_event.create({
      data: {
        topic_id: topicNow.id,
        actor_id: event.userId,
        topic_event_topic: {
          create: {
            from_closed_at: topicBefore.closed_at,
            to_closed_at: topicNow.closed_at,
          },
        },
      },
    });
  }

  const isArchivedStatusChanged = topicNow.archived_at !== topicBefore.archived_at;
  if (isArchivedStatusChanged) {
    await db.topic_event.create({
      data: {
        topic_id: topicNow.id,
        actor_id: event.userId,
        topic_event_topic: {
          create: {
            from_archived_at: topicBefore.archived_at,
            to_archived_at: topicNow.archived_at,
          },
        },
      },
    });
  }

  const isNameChanged = topicNow.name !== topicBefore.name;
  if (isNameChanged) {
    await db.topic_event.create({
      data: {
        topic_id: topicNow.id,
        actor_id: event.userId,
        topic_event_topic: {
          create: {
            from_name: topicBefore.name,
            to_name: topicNow.name,
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

  if (wasJustClosed) {
    const topicCloser = userIdThatClosedTopic ?? "web-app";
    trackBackendUserEvent(topicCloser, "Closed Topic", { topicId: event.item.id });
  }

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
