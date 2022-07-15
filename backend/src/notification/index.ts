import {
  archiveGmailMessageForNotification,
  markDriveMessageAsReadForNotification,
} from "@aca/backend/src/gmail/capture";
import { HasuraEvent, UpdateHasuraEvent } from "@aca/backend/src/hasura";
import { Notification, db } from "@aca/db";
import { logger } from "@aca/shared/logger";

// Add newly resolved Slack message notifications to the user_slack_conversation_read debounce buffer table which
// is used to mark messages as read in the Slack API.
async function addRelatedSlackMessageToMarkAsReadQueue(notification_id: string) {
  const slackMessage = await db.notification_slack_message.findFirst({ where: { notification_id } });
  const messageTs = slackMessage?.slack_message_ts;
  if (!messageTs || !slackMessage.user_slack_installation_id || slackMessage.slack_thread_ts) {
    // threads can not be marked as read yet in the Slack API
    return;
  }
  const keyFields = {
    user_slack_installation_id: slackMessage.user_slack_installation_id,
    slack_conversation_id: slackMessage.slack_conversation_id,
  };
  const existing = await db.user_slack_conversation_read.findFirst({ where: keyFields });
  if (existing) {
    await db.user_slack_conversation_read.update({
      where: { id: existing.id },
      data: {
        // we want to trigger an update even if this field remains unchanged to bump updated_at
        slack_last_message_ts:
          Number(existing.slack_last_message_ts) > Number(messageTs) ? existing.slack_last_message_ts : messageTs,
      },
    });
  } else {
    // this fails quite often and pollutes sentry with too many errors
    try {
      await db.user_slack_conversation_read.upsert({
        where: { user_slack_installation_id_slack_conversation_id: keyFields },
        create: { ...keyFields, slack_last_message_ts: messageTs },
        update: {},
      });
    } catch (e) {
      logger.warn(e);
    }
  }
}

export async function handleNotificationChanges(event: HasuraEvent<Notification>) {
  if (event.type == "update") {
    await handleNotificationUpdates(event);
  }
}

async function handleNotificationUpdates(event: UpdateHasuraEvent<Notification>) {
  if (event.item.resolved_at && !event.itemBefore.resolved_at) {
    await addRelatedSlackMessageToMarkAsReadQueue(event.item.id);
    await archiveGmailMessageForNotification(event.item.id);
  }

  if (event.item.last_seen_at && !event.itemBefore.last_seen_at) {
    await markDriveMessageAsReadForNotification(event.item.id);
  }
}
