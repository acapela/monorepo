import gql from "graphql-tag";

import { defineEntity } from "@aca/clientdb";
import { EntityByDefinition } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
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
});

export type NotificationGmailEntity = EntityByDefinition<typeof notificationGmailEntity>;
