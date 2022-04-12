import { subMinutes } from "date-fns";
import { groupBy } from "lodash";

import { HasuraEvent } from "@aca/backend/src/hasura";
import { SlackInstallation, slackClient } from "@aca/backend/src/slack/app";
import { NotificationSlackMessage, db } from "@aca/db";
import { logger } from "@aca/shared/logger";

export async function handleNotificationSlackMessageChanges(event: HasuraEvent<NotificationSlackMessage>) {
  if (event.type == "delete") {
    await db.notification.delete({ where: { id: event.item.notification_id } });
  }
}

export async function markSlackConversationsAsRead() {
  const oldReadConversations = await db.user_slack_conversation_read.findMany({
    where: { updated_at: { lt: subMinutes(new Date(), 1).toISOString() } },
    include: { user_slack_installation: true },
  });
  // We try to group conversations on the db level, but there is room for race conditions, so we also group
  // after querying
  const groupedConversations = groupBy(oldReadConversations, (c) =>
    JSON.stringify([c.user_slack_installation_id, c.slack_conversation_id, c.slack_thread_ts])
  );
  for (const items of Object.values(groupedConversations)) {
    const [{ user_slack_installation, slack_conversation_id }] = items;
    const lastMessageTs = items.reduce(
      (acc, { slack_last_message_ts }) => Math.max(acc, Number(slack_last_message_ts)),
      0
    );
    try {
      await slackClient.conversations.mark({
        token: (user_slack_installation.data as unknown as SlackInstallation).user.token,
        channel: slack_conversation_id,
        ts: lastMessageTs.toString(),
      });
    } catch (e) {
      logger.error(e);
    }
  }
  await db.user_slack_conversation_read.deleteMany({
    // Do not delete conversations that have been updated in the meanwhile
    where: { OR: oldReadConversations.map((c) => ({ id: c.id, updated_at: c.updated_at })) },
  });
}
