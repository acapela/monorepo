import { Topic, db } from "~db";
import { assert } from "~shared/assert";
import { routes } from "~shared/routes";

import { HasuraEvent } from "../hasura";
import { sendNotificationPerPreference } from "../notifications/sendNotification";
import { createClosureMessage } from "../slack/blocks/topicClosed";
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
      const topicCloser = await db.user.findFirst({ where: { id: userIdThatClosedTopic as string } });

      assert(topicOwner, `[Closing Topic][id=${event.item.id}] Owner ${ownerId} not found.`);
      assert(topicCloser, `[Closing Topic][id=${event.item.id}] Topic closer ${userIdThatClosedTopic} not found.`);
      const topicURL = `${process.env.FRONTEND_URL}${routes.topic({ topicSlug: event.item.slug })}`;

      sendNotificationPerPreference(topicOwner, event.item.team_id, {
        email: {
          subject: `${event.item.name} was closed by ${topicCloser.name}`,
          html: `Click <a href="${topicURL}">here</a> to see topic`,
        },
        slack: createClosureMessage({
          closedBy: topicCloser.name,
          topicId: event.item.id,
          topicName: event.item.name,
          topicURL,
        }),
      });
    }
  }
}
