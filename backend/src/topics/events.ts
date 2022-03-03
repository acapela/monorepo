import { get } from "lodash";

import { updateHomeView } from "@aca/backend/src/slack/home-tab";
import { tryUpdateTaskSlackMessages } from "@aca/backend/src/slack/live-messages/LiveTaskMessage";
import { tryUpdateTopicSlackMessage } from "@aca/backend/src/slack/live-messages/LiveTopicMessage";
import { Topic, TopicMember, db } from "@aca/db";
import { assert } from "@aca/shared/assert";
import { isEqualForPick } from "@aca/shared/object";

import { HasuraEvent } from "../hasura";
import { createClosureNotificationMessage } from "../notifications/bodyBuilders/topicClosed";
import { sendNotificationPerPreference } from "../notifications/sendNotification";
import { backendGetTopicUrl } from "./url";

async function updateSlackHomeTab(item: Topic) {
  const slackInstallation = await db.team_slack_installation.findFirst({
    where: {
      team_id: item.team_id,
    },
  });
  const botToken = get(slackInstallation?.data, "bot.token");
  if (!botToken) return;

  const teamMemberTopicOwner = await db.team_member.findFirst({
    where: {
      user_id: item.owner_id,
      team_id: item.team_id,
    },
    include: {
      team_member_slack: true,
    },
  });
  const slackUserId = get(teamMemberTopicOwner, "team_member_slack.slack_user_id");
  if (!slackUserId) return;

  await updateHomeView(botToken, slackUserId);
}

export async function handleTopicUpdates(event: HasuraEvent<Topic>) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (event.type === "create") {
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

    await updateSlackHomeTab(event.item);
  } else if (event.type === "update") {
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
  assert(topicBefore, `Updated topic ${event.item.id} didn't contain previous topic data`);

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

  assert(event.itemBefore, `Updated topic ${topic.id} didn't contain previous topic data`);

  if (!isEqualForPick(topic, event.itemBefore, ["name", "closed_at", "priority"])) {
    await Promise.all([
      tryUpdateTopicSlackMessage(topic.id),
      tryUpdateTaskSlackMessages({
        taskSlackMessage: { task: { message: { topic_id: topic.id } } },
        message: { topic_id: topic.id },
      }),
    ]);
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
      topicURL: await backendGetTopicUrl(topic),
    }),
    topic.id
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
