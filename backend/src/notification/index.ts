import { HasuraEvent } from "@aca/backend/src/hasura";
import { Notification, db } from "@aca/db";

export async function handleNotificationChanges(event: HasuraEvent<Notification>) {
  if (event.type !== "update") {
    return;
  }

  if (event.item.resolved_at && !event.itemBefore.resolved_at) {
    // Add newly resolved Slack message notifications to the user_slack_conversation_read debounce buffer table which
    // is used to mark messages as read in the Slack API.
    const slackMessage = await db.notification_slack_message.findFirst({ where: { notification_id: event.item.id } });
    const messageTs = slackMessage?.slack_message_ts;
    if (messageTs && slackMessage.user_slack_installation_id) {
      slackMessage.user_slack_installation_id;
      const keyFields = {
        user_slack_installation_id: slackMessage.user_slack_installation_id,
        slack_conversation_id: slackMessage.slack_conversation_id,
        slack_thread_ts: slackMessage.slack_thread_ts,
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
        await db.user_slack_conversation_read.create({ data: { ...keyFields, slack_last_message_ts: messageTs } });
      }
    }
  }
}
