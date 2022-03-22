import { HasuraEvent } from "@aca/backend/src/hasura";
import { NotificationSlackMessage, db } from "@aca/db";

export async function handleNotificationSlackMessageChanges(event: HasuraEvent<NotificationSlackMessage>) {
  if (event.type == "delete") {
    await db.notification.delete({ where: { id: event.item.notification_id } });
  }
}
