import { observer } from "mobx-react";
import React, { useEffect } from "react";

import { notionSyncPayload } from "@aca/desktop/bridge/apps/notion";
import { useNullableDb } from "@aca/desktop/clientdb/ClientDbProvider";

import { useCurrentUser } from "./auth/useCurrentUser";

export const ServiceWorkerConsolidation = observer(function ServiceWorkerConsolidation() {
  const db = useNullableDb();
  const user = useCurrentUser();

  useEffect(() => {
    if (!db || !user) {
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
  }, [user, db]);

  return <></>;
});
