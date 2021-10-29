import { Topic, db } from "~db";
import { assert } from "~shared/assert";
import { trackBackendUserEvent } from "~shared/backendAnalytics";
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
    const ownerId = event.item.owner_id;
    const userIdThatClosedTopic = event.item.closed_by_user_id;

    const isClosedByOwner = ownerId === userIdThatClosedTopic;
    const wasJustClosed = event.item.closed_at && !event.itemBefore.closed_at;

    if (wasJustClosed) {
      const topicCloser = userIdThatClosedTopic ?? "web-app";
      trackBackendUserEvent(topicCloser, "Closed Topic", { topicId: event.item.id });
    }

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
