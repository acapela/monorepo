import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { NotificationDriveFragment } from "@aca/gql";

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
  keyField: "id",
  keys: getFragmentKeys<NotificationDriveFragment>(notificationDriveFragment),
  sync: createHasuraSyncSetupFromFragment<NotificationDriveFragment>(notificationDriveFragment),
}).addConnections((notificationDriveEntity, { getEntity }) => {
  const connections = {
    get documentName() {
      return getEntity(googleDriveFileEntity).findById(notificationDriveEntity.google_drive_file_id)?.name;
    },
    get source() {
      return getEntity(googleDriveFileEntity).findById(notificationDriveEntity.google_drive_file_id)?.source;
    },
  };
  return connections;
});

export type NotificationDriveEntity = EntityByDefinition<typeof notificationDriveEntity>;
