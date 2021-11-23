import * as Sentry from "@sentry/node";
import { updatedDiff } from "deep-object-diff";

import { tryUpdateTopicSlackMessage } from "~backend/src/slack/LiveTopicMessage";
import { Topic, TopicMember, db } from "~db";
import { assert } from "~shared/assert";
import { trackBackendUserEvent } from "~shared/backendAnalytics";
import { isEqualForPick } from "~shared/object";
import { routes } from "~shared/routes";

import { HasuraEvent } from "../hasura";
import { createClosureNotificationMessage } from "../notifications/bodyBuilders/topicClosed";
import { sendNotificationPerPreference } from "../notifications/sendNotification";

function trackTopicChanges(event: HasuraEvent<Topic>) {
  if (!event.userId) return;
  const topicId = event.item.id;
  const changes = updatedDiff(event.itemBefore || {}, event.item || {}) as Topic;
  let key: keyof Topic;
  for (key in changes) {
    const value = changes[key];
    switch (key) {
      case "closed_by_user_id":
        trackBackendUserEvent(event.userId, value ? "Closed Request" : "Reopened Request", { topicId });
        break;
      case "archived_at":
        trackBackendUserEvent(event.userId, value ? "Archived Request" : "Unarchived Request", { topicId });
        break;
      case "name":
        trackBackendUserEvent(event.userId, "Renamed Request", { topicId });
        break;
    }
  }
}

export async function handleTopicUpdates(event: HasuraEvent<Topic>) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (event.type === "create") {
    // This is a test event that will duplicate all the other create topic events.
    // If the sum of all other origins don't add up to "unknown", then this is a hint to the issue
    // https://linear.app/acapela/issue/ACA-862/research-if-our-analitycs-is-blocked-validate-privacy-blockers
    if (event.userId) {
      trackBackendUserEvent(event.userId, "Created Request", { origin: "unknown", topicName: event.item.name });
    }

    const user_id = event.item.owner_id;
    const topic_id = event.item.id;
    const hasTopicOwnerBeenAddedAsMember = await db.topic_member.findFirst({
      where: {
        user_id,
        topic_id,
      },
    });

    // Check avoids race condition from hasura event triggers,
    // when topic owner is added as member through the topic's first message
    if (!hasTopicOwnerBeenAddedAsMember) {
      await db.topic_member.create({
        data: {
          user_id: event.item.owner_id,
          topic_id: event.item.id,
        },
      });
    }
  } else if (event.type === "update") {
    trackTopicChanges(event);
    await Promise.all([notifyTopicUpdates(event), updateTopicEvents(event)]);
  }
}

async function updateTopicEvents(event: HasuraEvent<Topic>) {
  // All user-originated events are handled in the frontend
  const isUpdateOriginatedFromSystem = !event.userId;
  if (!isUpdateOriginatedFromSystem) {
    return;
  }

  const topicNow = event.item;
  const topicBefore = event.itemBefore;

  // Should never be null on event updates
  assert(topicBefore, "Updated topic didn't contain previous topic data");

  const isOpenStatusChanged = topicNow.closed_at !== topicBefore.closed_at;
  if (isOpenStatusChanged) {
    await db.topic_event.create({
      data: {
        topic_id: topicNow.id,
        topic_from_closed_at: topicBefore.closed_at,
        topic_to_closed_at: topicNow.closed_at,
      },
    });
  }

  const isArchivedStatusChanged = topicNow.archived_at !== topicBefore.archived_at;
  if (isArchivedStatusChanged) {
    await db.topic_event.create({
      data: {
        topic_id: topicNow.id,
        topic_from_archived_at: topicBefore.archived_at,
        topic_to_archived_at: topicNow.archived_at,
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
    tryUpdateTopicSlackMessage(topic).catch((error) => Sentry.captureException(error));
  }

  if (wasJustClosed && !isClosedByOwner) {
    return notifyOwnerOfTopicClosure(ownerId, userIdThatClosedTopic as string, topic);
  }
}

async function notifyOwnerOfTopicClosure(ownerId: string, userIdThatClosedTopic: string, topic: Topic) {
  const topicOwner = await db.user.findFirst({ where: { id: ownerId } });
  const topicCloser = userIdThatClosedTopic
    ? await db.user.findFirst({ where: { id: userIdThatClosedTopic as string } })
    : null;

  assert(topicOwner, `[Closing Topic][id=${topic.id}] Owner ${ownerId} not found.`);

  return sendNotificationPerPreference(
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

export async function handleTopicMemberChanges(event: HasuraEvent<TopicMember>) {
  if (event.type !== "create") {
    return;
  }

  /**
   * We need to bump all the timestamps of topic related entities for which access depends on topic membership.
   * Otherwise ClientDb users will have missing data for entities older than their membership.
   */
  const updated_at = new Date().toISOString();
  const { topic_id } = event.item;
  await db.$transaction([
    db.topic.update({ where: { id: topic_id }, data: { updated_at } }),
    db.topic_slack_message.updateMany({ where: { topic_id }, data: { updated_at } }),
    db.message.updateMany({ where: { topic_id }, data: { updated_at } }),
    db.message_reaction.updateMany({ where: { message: { topic_id } }, data: { updated_at } }),
    db.task.updateMany({ where: { message: { topic_id } }, data: { updated_at } }),
  ]);
}
