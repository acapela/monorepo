import { observer } from "mobx-react";
import React, { useEffect } from "react";

import { workerSyncStart } from "@aca/desktop/bridge/apps";
import { notionSyncPayload } from "@aca/desktop/bridge/apps/notion";
import { useNullableDb } from "@aca/desktop/clientdb/ClientDbProvider";
import { useBoolean } from "@aca/shared/hooks/useBoolean";

import { figmaSyncPayload } from "../bridge/apps/figma";
import { useCurrentUser } from "./auth/useCurrentUser";

export const ServiceWorkerConsolidation = observer(function ServiceWorkerConsolidation() {
  const db = useNullableDb();
  const user = useCurrentUser();

  const [isReadyToSync, { set: setReadyToSync }] = useBoolean(false);

  useEffect(() => {
    if (db && user && !isReadyToSync) {
      console.info("[Service Worker Consolidation] Enable worker sync");
      workerSyncStart(true).then(setReadyToSync);
    }
  }, [db, user, isReadyToSync]);

  useEffect(() => {
    if (!isReadyToSync) {
      console.info("[Service Worker Consolidation] still waiting for client session");
      return;
    }

    console.info("[Service Worker Consolidation] Enable worker subscription handling");

    notionSyncPayload.subscribe((data) => {
      if (!db || !user) {
        console.info("[Service Worker Consolidation] still waiting for client session");
        return;
      }

      console.info(`[Service Worker Consolidation] Syncing ${data.length} Notion notifications`);
      for (const { notification, notionNotification, type } of data) {
        const existingNotification = db.notificationNotion.findByUniqueIndex(
          "notion_original_notification_id",
          notionNotification.notion_original_notification_id
        );

        if (existingNotification) {
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
        console.info("[Service Worker Consolidation] still waiting for client session");
        return;
      }

      console.info("[Service Worker Consolidation] Syncing Figma notifications");
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
