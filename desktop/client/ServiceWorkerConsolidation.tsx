import { observer } from "mobx-react";
import React, { useEffect } from "react";

import { workerSyncStart } from "@aca/desktop/bridge/apps";
import { figmaSyncPayload } from "@aca/desktop/bridge/apps/figma";
import { notionSyncPayload } from "@aca/desktop/bridge/apps/notion";
import { useNullableDb } from "@aca/desktop/clientdb/ClientDbProvider";
import { useBoolean } from "@aca/shared/hooks/useBoolean";

import { useCurrentUser } from "./auth/useCurrentUser";

export const ServiceWorkerConsolidation = observer(function ServiceWorkerConsolidation() {
  const db = useNullableDb();
  const user = useCurrentUser();

  const [isReadyToSync, { set: setReadyToSync }] = useBoolean(false);

  useEffect(() => {
    if (db && user && !isReadyToSync) {
      workerSyncStart(true).then(setReadyToSync);
    }
  }, [db, user, isReadyToSync]);

  useEffect(() => {
    if (!isReadyToSync) {
      console.info("[Service Worker Consolidation] still waiting for client session");
      return;
    }

    notionSyncPayload.subscribe((data) => {
      if (!db || !user) {
        console.info("[Service Worker Consolidation] still waiting for client session");
        return;
      }

      const { notification, userMentionedNotification } = data;

      console.info("[Service Worker Consolidation] Syncing Notion Base notifications");
      for (const n of notification) {
        const existingNotification = db.notification.findById(n.id);
        if (!existingNotification) {
          db.notification.create(n);
        }
      }

      console.info("[Service Worker Consolidation] Syncing Notion User Mentioned Notifications");
      for (const n of userMentionedNotification) {
        const existingNotification = db.notificationNotionUserMentioned.findByUniqueIndex(
          "notification_id",
          n.notification_id
        );

        if (!existingNotification) {
          db.notificationNotionUserMentioned.create(n);
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
