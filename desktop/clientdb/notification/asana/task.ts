import gql from "graphql-tag";

import { defineEntity } from "@aca/clientdb";
import { EntityByDefinition } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { NotificationAsanaFragment } from "@aca/gql";

const notificationAsanaFragment = gql`
  fragment NotificationAsana on notification_asana {
    id
    notification_id
    created_at
    updated_at
    task_id
    type
    title
  }
`;

export const notificationAsanaEntity = defineEntity<NotificationAsanaFragment>({
  name: "notification_asana",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<NotificationAsanaFragment>(notificationAsanaFragment),
  sync: createHasuraSyncSetupFromFragment<NotificationAsanaFragment>(notificationAsanaFragment),
});

export type NotificationAsanaEntity = EntityByDefinition<typeof notificationAsanaEntity>;
