import { addSeconds, subHours, subSeconds } from "date-fns";

import { HasuraEvent } from "@aca/backend/src/hasura";
import { SlackInstallation, slackClient } from "@aca/backend/src/slack/app";
import { captureGeneralChannel, captureInitialMessages } from "@aca/backend/src/slack/capture";
import { syncUserSlackInstallationTeam } from "@aca/backend/src/slack/sync";
import { NotificationSlackMessage, UserSlackInstallation, db } from "@aca/db";
import { logger } from "@aca/shared/logger";

export async function handleUserSlackInstallationChanges(event: HasuraEvent<UserSlackInstallation>) {
  if (event.type !== "create") {
    return;
  }
  const userSlackInstallation = event.item;
  await Promise.all([
    captureInitialMessages(userSlackInstallation),
    captureGeneralChannel(userSlackInstallation),
    syncUserSlackInstallationTeam(userSlackInstallation),
  ]);
}

export async function handleNotificationSlackMessageChanges(event: HasuraEvent<NotificationSlackMessage>) {
  if (event.type == "delete") {
    await db.notification.delete({ where: { id: event.item.notification_id } });
  }
}

export async function markSlackConversationsAsRead() {
  // In case of downtime or bugs in the queue-clearing mechanism we do not want to be overburdened by old messages
  await db.user_slack_conversation_read.deleteMany({ where: { updated_at: { lt: subHours(new Date(), 1) } } });

  const oldReadConversations = await db.user_slack_conversation_read.findMany({
    where: { updated_at: { lt: subSeconds(new Date(), 30).toISOString() } },
    include: { user_slack_installation: true },
  });
  for (const readConversation of oldReadConversations) {
    try {
      const token = (readConversation.user_slack_installation.data as unknown as SlackInstallation).user.token;
      const channel = readConversation.slack_conversation_id;
      const { channel: conversation } = await slackClient.conversations.info({ token, channel });
      if (Number(conversation?.last_read) < Number(readConversation.slack_last_message_ts)) {
        await slackClient.conversations.mark({
          token,
          channel,
          ts: readConversation.slack_last_message_ts,
        });
      }
    } catch (e) {
      logger.error(e);
    }
  }
  await db.user_slack_conversation_read.deleteMany({
    where: {
      OR: oldReadConversations.map((c) => ({
        id: c.id,
        // Do not delete conversations that have been updated in the meanwhile, we need to add a buffer second
        // since we can lose precision in the float-conversion of timestamps from pg to js
        updated_at: { lte: addSeconds(c.updated_at, 1) },
      })),
    },
  });
}
