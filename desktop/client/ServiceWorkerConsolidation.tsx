import { observer } from "mobx-react";
import React, { useEffect } from "react";

import { workerSyncStart } from "@aca/desktop/bridge/apps";
import { figmaSyncPayload } from "@aca/desktop/bridge/apps/figma";
import { notionSyncPayload } from "@aca/desktop/bridge/apps/notion";
import { getNullableDb } from "@aca/desktop/clientdb";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { authStore } from "@aca/desktop/store/auth";
import { useBoolean } from "@aca/shared/hooks/useBoolean";

const log = makeLogger("Worker-Consolidation");

export const ServiceWorkerConsolidation = observer(function ServiceWorkerConsolidation() {
  const db = getNullableDb();
  const user = authStore.userTokenData;

  const [isReadyToSync, { set: setReadyToSync }] = useBoolean(false);

  useEffect(() => {
    if (db && user && !isReadyToSync) {
      log.info("Worker Sync Enabled");
      workerSyncStart(true).then(setReadyToSync);
    }
  }, [db, user, isReadyToSync]);

  useEffect(() => {
    if (!isReadyToSync) {
      log.debug("Still waiting for client session - Not ready to sync");
      return;
    }

    log.debug("Begin worker consolidation sync subscriptions");

    notionSyncPayload.subscribe((data) => {
      if (!db || !user) {
        log.debug("[notionSyncPayload] Still waiting for client session");
        return;
      }

      log.debug(`Syncing ${data.length} Notion notifications`);
      for (const { notification, notionNotification, type } of data) {
        const existingNotification = db.notificationNotion.findByUniqueIndex(
          "notion_original_notification_id",
          notionNotification.notion_original_notification_id
        );

        if (existingNotification) {
          // TODO: Delete update ~3weeks after 1.Feb.2022
          // First version of notifications don't have space_id
          // This covers those cases.
          if (!existingNotification.space_id) {
            existingNotification.update({ space_id: notionNotification.space_id });
          }
          continue;
        }

        const createdNotification = db.notification.create(notification);

        const createdNotionNotification = db.notificationNotion.create({
          ...notionNotification,
          notification_id: createdNotification.id,
        });

        if (type === "notification_notion_commented") {
          db.notificationNotionCommented.create({ notification_notion_id: createdNotionNotification.id });
        } else if (type === "notification_notion_user_mentioned") {
          db.notificationNotionUserMentioned.create({ notification_notion_id: createdNotionNotification.id });
        } else if (type === "notification_notion_user_invited") {
          db.notificationNotionUserInvited.create({ notification_notion_id: createdNotionNotification.id });
        }
      }
    });

    figmaSyncPayload.subscribe((data) => {
      if (!db || !user) {
        log.debug("[figmaSyncPayload] still waiting for client session");
        return;
      }

      log.debug(`Syncing ${data.length} Figma notifications`);
      for (const { notification, commentNotification } of data) {
        // TODO: Refactor once we have other figma notification types
        if (!commentNotification) {
          continue;
        }

        const existingNotification = db.notificationFigmaComment.findByUniqueIndex(
          "figma_notification_id",
          commentNotification.figma_notification_id
        );

        if (existingNotification) {
          existingNotification.update({ file_name: commentNotification.file_name });
          continue;
        }

        const createdNotification = db.notification.create(notification);
        db.notificationFigmaComment.create({ ...commentNotification, notification_id: createdNotification.id });
      }
    });
  }, [isReadyToSync]);

  return <></>;
});
