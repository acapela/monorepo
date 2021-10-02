import { db } from "~db";
import { log } from "~shared/logger";

import { HasuraEvent } from "../hasura";

export async function handleCreateSyncRequests(event: HasuraEvent<unknown>) {
  const { item, userId } = event;

  // Created entities will be synced normally basing on updated_at
  if (event.type === "create") {
    return;
  }

  if (!userId) {
    log.warn(`Cannot create sync request for system caused database changes (no way to get user.current_team_id)`);
    return;
  }

  const user = await db.user.findFirst({ where: { id: userId } });

  if (!user) {
    log.warn(`Failed to create sync request - could not find user with id ${userId}`);
    return;
  }

  const teamId = user.current_team_id;

  if (!teamId) {
    log.warn(`Failed to create sync request - no current team id for user causing the action`);
    return;
  }

  const itemId = Reflect.get(item as object, "id");

  if (!itemId) {
    log.warn(`Failed to create sync request - no item id`);
    return;
  }

  await db.sync_request.create({
    data: {
      change_type: event.type,
      team_id: teamId,
      entity_name: event.tableName,
      date: event.date,
      entity_id: itemId,
      user_id: event.userId,
    },
  });

  log.info(`sync request created`);
}
