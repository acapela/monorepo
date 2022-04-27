import gql from "graphql-tag";

import { defineEntity } from "@aca/clientdb";
import { EntityByDefinition } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { notificationEntity } from "@aca/desktop/clientdb/notification";
import { NotificationGmailFragment } from "@aca/gql";

const notificationGmailFragment = gql`
  fragment NotificationGmail on notification_gmail {
    id
    notification_id
    created_at
    updated_at
    gmail_account_id
    gmail_thread_id
  }
`;

export const notificationGmailEntity = defineEntity<NotificationGmailFragment>({
  name: "notification_gmail",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<NotificationGmailFragment>(notificationGmailFragment),
  sync: createHasuraSyncSetupFromFragment<NotificationGmailFragment>(notificationGmailFragment),
}).addConnections((gmailMessage, { getEntity }) => ({
  get notification() {
    return getEntity(notificationEntity).findById(gmailMessage.notification_id);
  },
}));

export type NotificationGmailEntity = EntityByDefinition<typeof notificationGmailEntity>;
