import { subSeconds } from "date-fns";

import { HasuraEvent } from "@aca/backend/src/hasura";
import { SlackInstallation, slackClient } from "@aca/backend/src/slack/app";
import { captureInitialMessages } from "@aca/backend/src/slack/capture";
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
    syncUserSlackInstallationTeam(userSlackInstallation),
  ]);
}

export async function handleNotificationSlackMessageChanges(event: HasuraEvent<NotificationSlackMessage>) {
  if (event.type == "delete") {
    await db.notification.delete({ where: { id: event.item.notification_id } });
  }
}

export async function markSlackConversationsAsRead() {
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
    // Do not delete conversations that have been updated in the meanwhile
    where: { OR: oldReadConversations.map((c) => ({ id: c.id, updated_at: c.updated_at })) },
  });
}
