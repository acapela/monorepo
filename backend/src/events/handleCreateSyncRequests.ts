import { db } from "@aca/db";
import { logger } from "@aca/shared/logger";

import { HasuraEvent } from "../hasura";

export async function handleCreateSyncRequests(event: HasuraEvent<unknown>) {
  const { item, userId } = event;

  // Created entities will be synced normally basing on updated_at
  if (event.type === "create") {
    return;
  }

  /**
   * For each change (update/delete) we want to create sync request. For permission and performance reasons we want
   * to add team_id to each to narrow down the scope.
   *
   * TODO: currently we take a simple approach of just assuming the team = user.current_team_id.
   *
   * It has limitations of not supporting 'system' changes (eg. admin changing something in hasura panel).
   * Also there is possible unlikely race condition that user changes current_team_id before sync request is created.
   *
   * Alternative is to read team id from updated/removed entity, but it is tricky and potentially not possible sometimes:
   * eg. message is removed as result of SQL cascade, so when we try to get message > topic.team_id, we'll not be able to
   * as topic no longer exists. TBH I'm not sure how to solve it nicely.
   */

  if (!userId) {
    logger.warn(`Cannot create sync request for system caused database changes (no way to get user.current_team_id)`);
    return;
  }

  const user = await db.user.findFirst({ where: { id: userId } });

  if (!user) {
    logger.warn(`Failed to create sync request - could not find user with id ${userId}`);
    return;
  }

  const teamId = user.current_team_id;

  if (!teamId) {
    logger.warn(`Failed to create sync request - no current team id for user causing the action`);
    return;
  }

  const itemId = Reflect.get(item as object, "id");

  if (!itemId) {
    logger.warn(`Failed to create sync request - no item id`);
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

  logger.info(`sync request created`);
}
