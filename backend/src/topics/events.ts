import { Topic, db } from "~db";
import { assert } from "~shared/assert";
import { routes } from "~shared/routes";

import { HasuraEvent } from "../hasura";
import { createClosureNotificationMessage } from "../notifications/bodyBuilders/topicClosed";
import { sendNotificationPerPreference } from "../notifications/sendNotification";
import { markAllOpenTasksAsDone } from "../tasks/taskHandlers";

export async function handleTopicUpdates(event: HasuraEvent<Topic>) {
  if (event.type === "update") {
    const wasJustClosed = event.item.closed_at && !event.itemBefore.closed_at;

    if (wasJustClosed && event.userId) {
      await markAllOpenTasksAsDone(event.item);
    }

    const ownerId = event.item.owner_id;
    const userIdThatClosedTopic = event.item.closed_by_user_id;

    const isClosedByOwner = ownerId === userIdThatClosedTopic;
    if (wasJustClosed && !isClosedByOwner) {
      const topicOwner = await db.user.findFirst({ where: { id: ownerId } });
      const topicCloser = userIdThatClosedTopic
        ? await db.user.findFirst({ where: { id: userIdThatClosedTopic as string } })
        : null;

      assert(topicOwner, `[Closing Topic][id=${event.item.id}] Owner ${ownerId} not found.`);

      const topicURL = `${process.env.FRONTEND_URL}${routes.topic({ topicSlug: event.item.slug })}`;

      const topicName = event.item.name;

      sendNotificationPerPreference(
        topicOwner,
        event.item.team_id,
        createClosureNotificationMessage({
          closedBy: topicCloser?.name,
          topicId: event.item.id,
          topicName,
          topicURL,
        })
      );
    }
  }
}
