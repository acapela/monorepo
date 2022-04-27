import gql from "graphql-tag";

import { defineEntity } from "@aca/clientdb";
import { EntityByDefinition } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { NotificationClickUpFragment } from "@aca/gql";

const notificationClickUpFragment = gql`
  fragment NotificationClickUp on notification_clickup {
    id
    notification_id
    created_at
    updated_at
    task_id
    type
    title
  }
`;

export const notificationClickUpEntity = defineEntity<NotificationClickUpFragment>({
  name: "notification_clickup",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<NotificationClickUpFragment>(notificationClickUpFragment),
  sync: createHasuraSyncSetupFromFragment<NotificationClickUpFragment>(notificationClickUpFragment),
});

export type NotificationClickUpEntity = EntityByDefinition<typeof notificationClickUpEntity>;
