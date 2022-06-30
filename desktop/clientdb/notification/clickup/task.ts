import gql from "graphql-tag";

import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { NotificationClickUpFragment } from "@aca/gql";
import { defineEntity } from "@acapela/clientdb";
import { EntityByDefinition } from "@acapela/clientdb";

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
  idField: "id",
  keys: getFragmentKeys<NotificationClickUpFragment>(notificationClickUpFragment),
  sync: createHasuraSyncSetupFromFragment<NotificationClickUpFragment>(notificationClickUpFragment),
});

export type NotificationClickUpEntity = EntityByDefinition<typeof notificationClickUpEntity>;
