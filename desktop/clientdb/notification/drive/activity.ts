import gql from "graphql-tag";

import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { NotificationDriveFragment } from "@aca/gql";
import { EntityByDefinition, defineEntity } from "@acapela/clientdb";

import { googleDriveFileEntity } from "./file";

export const notificationDriveFragment = gql`
  fragment NotificationDrive on notification_drive {
    id

    google_drive_file_id
    notification_id
    type

    gmail_account_id
    gmail_message_id
    gmail_thread_id

    created_at
    updated_at
  }
`;

export const notificationDriveEntity = defineEntity<NotificationDriveFragment>({
  name: "notification_drive",
  updatedAtField: "updated_at",
  idField: "id",
  keys: getFragmentKeys<NotificationDriveFragment>(notificationDriveFragment),
  sync: createHasuraSyncSetupFromFragment<NotificationDriveFragment>(notificationDriveFragment),
}).addView((notificationDriveEntity, { db }) => {
  const connections = {
    get documentName() {
      return db.entity(googleDriveFileEntity).findById(notificationDriveEntity.google_drive_file_id)?.name;
    },
    get source() {
      return db.entity(googleDriveFileEntity).findById(notificationDriveEntity.google_drive_file_id)?.source;
    },
  };
  return connections;
});

export type NotificationDriveEntity = EntityByDefinition<typeof notificationDriveEntity>;
