import Sentry from "@sentry/node";

import { tryUpdateTopicSlackMessage } from "~backend/src/slack/LiveTopicMessage";
import { Topic, db } from "~db";
import { assert } from "~shared/assert";
import { trackBackendUserEvent } from "~shared/backendAnalytics";
import { isEqualForPick } from "~shared/object";
import { routes } from "~shared/routes";

import { HasuraEvent } from "../hasura";
import { createClosureNotificationMessage } from "../notifications/bodyBuilders/topicClosed";
import { sendNotificationPerPreference } from "../notifications/sendNotification";

export async function handleTopicUpdates(event: HasuraEvent<Topic>) {
  if (event.type === "create") {
    // This is a test event that will duplicate all the other create topic events.
    // If the sum of all other origins don't add up to "unknown", then this is a hint to the issue
    // https://linear.app/acapela/issue/ACA-862/research-if-our-analitycs-is-blocked-validate-privacy-blockers
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    trackBackendUserEvent(event.userId!, "Created Topic", { origin: "unknown", topicName: event.item.name });
  }

  if (event.type === "update") {
    notifyTopicUpdates(event);
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

async function notifyTopicUpdates(event: HasuraEvent<Topic>) {
  const topic = event.item;
  const ownerId = topic.owner_id;
  const userIdThatClosedTopic = topic.closed_by_user_id;

  const isClosedByOwner = ownerId === userIdThatClosedTopic;
  const wasJustClosed = topic.closed_at && event?.itemBefore?.closed_at === null;

  assert(event.itemBefore, "Updated topic didn't contain previous topic data");

  if (!isEqualForPick(topic, event.itemBefore, ["name", "closed_at"])) {
    tryUpdateTopicSlackMessage(topic).catch(Sentry.captureException);
  }

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

  sendNotificationPerPreference(
    topicOwner,
    topic.team_id,
    createClosureNotificationMessage({
      closedBy: topicCloser?.name,
      topicId: topic.id,
      topicName: topic.name,
      topicURL: `${process.env.FRONTEND_URL}${routes.topic({ topicSlug: topic.slug })}`,
    })
  );
}
