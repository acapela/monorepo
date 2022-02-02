import * as Sentry from "@sentry/electron";
import { omit } from "lodash";
import fetch from "node-fetch";

import { notificationResolvedChannel } from "@aca/desktop/bridge/notification";
import { figmaURL } from "@aca/desktop/electron/auth/figma";

import { getFigmaSessionData } from "./worker";

export async function initializeFigmaPush() {
  console.info("[Figma] Starting figma push handling");
  const session = await getFigmaSessionData();

  notificationResolvedChannel.subscribe(async (event) => {
    if (event.inner.__typename !== "notification_figma_comment") return;

    console.info("[Figma] Received resolved request 'notification_figma_comment'");

    const commentId = event.notification.url.split("#")[1];

    if (!commentId) {
      console.info(`[Figma] unable to resolve notification ${event.notification.id}: No comment_id found`);
      Sentry.captureException(
        `[Figma] No comment_id found \n notification: ${JSON.stringify(
          omit(event.notification, ["from"])
        )} \n\n  ${JSON.stringify(event.inner)}`
      );
      return;
    }

    const response = await fetch(figmaURL + `/api/file/${event.inner.file_id}/unread_comments`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        cookie: session.cookie,
        "x-figma-user-id": session.figmaUserId,
        "x-csrf-bypass": "yes",
        tsid: session.trackingSessionId,
      },
      body: JSON.stringify({
        comment_ids: [commentId],
      }),
    });

    if (!response.ok) {
      Sentry.captureException("[Figma] Unable to delete unread comment" + JSON.stringify(await response.json()));
    }
  });
}
