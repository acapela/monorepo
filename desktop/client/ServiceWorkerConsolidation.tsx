import { subDays } from "date-fns";
import { observer } from "mobx-react";
import React, { useEffect } from "react";

import { workerSyncStart } from "@aca/desktop/bridge/apps";
import { figmaSyncPayload } from "@aca/desktop/bridge/apps/figma";
import {
  notionAvailableSpacesValue,
  notionSelectedSpaceValue,
  notionSyncPayload,
} from "@aca/desktop/bridge/apps/notion";
import { getNullableDb } from "@aca/desktop/clientdb";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { authStore } from "@aca/desktop/store/auth";
import { assert } from "@aca/shared/assert";
import { useBoolean } from "@aca/shared/hooks/useBoolean";

import { notificationEntity } from "../clientdb/notification";
import { notificationFigmaCommentEntity } from "../clientdb/notification/figma/comment";
import { notificationNotionEntity } from "../clientdb/notification/notion/baseNotification";
import { notificationNotionCommentedEntity } from "../clientdb/notification/notion/commented";
import { notionSpaceEntity } from "../clientdb/notification/notion/notionSpace";
import { notionSpaceUserEntity } from "../clientdb/notification/notion/notionSpaceUser";
import { notificationNotionReminderEntity } from "../clientdb/notification/notion/reminder";
import { notificationNotionUserInvitedEntity } from "../clientdb/notification/notion/userInvited";
import { notificationNotionUserMentionedEntity } from "../clientdb/notification/notion/userMentioned";

const log = makeLogger("Worker-Consolidation");

export const ServiceWorkerConsolidation = observer(function ServiceWorkerConsolidation() {
  const db = getNullableDb();
  const user = authStore.userTokenData;
  const notionSpaces = notionAvailableSpacesValue.use();

  const [isReadyToSync, { set: setReadyToSync }] = useBoolean(false);

  function syncNotionSpacesFromClientDbToBridge() {
    assert(db, "db must be defined", log.error.bind(log));

    const selectedUserSpaces = db.entity(notionSpaceUserEntity).find({ is_sync_enabled: true });
    const selectedSpaces = selectedUserSpaces.map((spaceUser) => spaceUser.notionSpace);
    const allAvailableSpaces = db.entity(notionSpaceUserEntity).all.map((spaceUser) => spaceUser.notionSpace);

    const selected = selectedSpaces.map((sp) => sp.space_id);
    const spaces = allAvailableSpaces.map(({ space_id, name }) => ({ id: space_id, name }));

    if (selected.length > 0) {
      log.debug(`Syncing ${selected.length} selected spaces to bridge`);
      notionSelectedSpaceValue.set({ selected });
    }

    if (spaces.length > 0) {
      log.debug(`Syncing ${spaces.length} available spaces to bridge`);
      notionAvailableSpacesValue.set({ spaces });
    }
  }

  useEffect(() => {
    if (db && user && !isReadyToSync) {
      log.info("Worker Sync Enabled");
      workerSyncStart(true).then(setReadyToSync);

      syncNotionSpacesFromClientDbToBridge();
    }
  }, [db, user, isReadyToSync]);

  useEffect(() => {
    if (!isReadyToSync || !db) {
      return;
    }

    notionSpaces.spaces.forEach(async (notionSpace) => {
      let storedNotionSpace = db.entity(notionSpaceEntity).findFirst({ space_id: notionSpace.id });

      if (!storedNotionSpace) {
        storedNotionSpace = db.entity(notionSpaceEntity).create({
          name: notionSpace.name,
          space_id: notionSpace.id,
        });
      }

      const notionSpaceUser = db.entity(notionSpaceUserEntity).findFirst({ notion_space_id: storedNotionSpace.id });

      if (!notionSpaceUser) {
        db.entity(notionSpaceUserEntity).create({
          notion_space_id: storedNotionSpace.id,
          first_synced_at: new Date().toISOString(),
          // Everything is synced by default!
          // We're actually leaning towards too much notification and ability to reduce noise
          is_sync_enabled: true,
        });
      }
    });
  }, [notionSpaces]);

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

      log.debug(
        `Syncing ${data.length} Notion notifications ${
          data.length > 0 ? `from space ${data[0]?.notionNotification.synced_spaced_id}` : ""
        }`
      );
      for (const { notification, notionNotification, type, discussion_id } of data) {
        const existingNotification = db
          .entity(notificationNotionEntity)
          .findFirst({ notion_original_notification_id: notionNotification.notion_original_notification_id });

        if (existingNotification) {
          log.debug(
            `Notion notification with original id ${notionNotification.notion_original_notification_id} is synced`
          );

          // SANITY CHECK
          // The next is done to check if there's a some bugs in the consolidation process
          // It should be temporary until all of the bugs are found
          const particularNotionNotification = existingNotification.inner;
          if (!particularNotionNotification) {
            log.error(
              `[Notion] Existing notification not found for notificationNotion id: ${existingNotification.id}. Attempting to fix`
            );
            const notification = db.entity(notificationEntity).findById(existingNotification.notification_id)!;
            notification.remove();
            existingNotification.remove();
          } else {
            continue;
          }
        }

        const space = db.entity(notionSpaceEntity).findFirst({ space_id: notionNotification.synced_spaced_id });
        const spaceUser = db.entity(notionSpaceUserEntity).findFirst({ notion_space_id: space?.id as string });

        if (!spaceUser) {
          log.error("[Notion] space user should have existed when consolidating notifications");
          continue;
        }

        /*
          Aha! This looks a bit weird?!
          Well it has to do with the way we manage Notion.
          We use "Notion's Notification Archive" as an indication that a notification is resolved in our side
          
          When a user first syncs with Acapela, we want the initial sync to consist of a few "Demo" notifications.
          So we placed this indicator here as a way to get notifications that happened 3 days before
          first sync. Otherwise we'll endlessly keep on pulling old notifications as they come up.
        */
        const threeDaysBeforeFirstSync = subDays(new Date(spaceUser.first_synced_at), 3);
        const isNotificationEligibleForSync =
          new Date(notification.created_at).getTime() > threeDaysBeforeFirstSync.getTime();

        if (!isNotificationEligibleForSync) {
          log.debug(
            `[Notion] notification not eligible to sync. Date of first sync: ${spaceUser.first_synced_at}. Notification date: ${notification.created_at}`
          );
          continue;
        }

        const createdNotification = db.entity(notificationEntity).create(notification);

        const createdNotionNotification = db.entity(notificationNotionEntity).create({
          ...notionNotification,
          notification_id: createdNotification.id,
          notion_space_id: spaceUser.notion_space_id,
        });

        if (type === "notification_notion_commented") {
          db.entity(notificationNotionCommentedEntity).create({
            notification_notion_id: createdNotionNotification.id,
            discussion_id,
          });
        } else if (type === "notification_notion_user_mentioned") {
          db.entity(notificationNotionUserMentionedEntity).create({
            notification_notion_id: createdNotionNotification.id,
          });
        } else if (type === "notification_notion_user_invited") {
          db.entity(notificationNotionUserInvitedEntity).create({
            notification_notion_id: createdNotionNotification.id,
          });
        } else if (type === "notification_notion_reminder") {
          db.entity(notificationNotionReminderEntity).create({ notification_notion_id: createdNotionNotification.id });
        }
      }
    });

    figmaSyncPayload.subscribe((data) => {
      if (!db || !user) {
        log.debug("[Figma] still waiting for client session");
        return;
      }

      log.debug(`[Figma] Syncing ${data.length} notifications`);
      for (const { notification, commentNotification } of data) {
        // TODO: Refactor once we have other figma notification types
        if (!commentNotification) {
          log.error("[Figma] Should not happen");
          continue;
        }

        const existingNotification = db
          .entity(notificationFigmaCommentEntity)
          .findFirst({ figma_notification_id: commentNotification.figma_notification_id });

        if (existingNotification) {
          existingNotification.update({ file_name: commentNotification.file_name });
          continue;
        }

        const createdNotification = db.entity(notificationEntity).create(notification);
        db.entity(notificationFigmaCommentEntity).create({
          ...commentNotification,
          notification_id: createdNotification.id,
        });
      }
    });
  }, [isReadyToSync]);

  return <></>;
});
