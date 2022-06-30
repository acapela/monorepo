import gql from "graphql-tag";

import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { NotificationAcapelaFragment } from "@aca/gql";
import { defineEntity } from "@acapela/clientdb";
import { EntityByDefinition } from "@acapela/clientdb";

const notificationAcapelaFragment = gql`
  fragment NotificationAcapela on notification_acapela {
    id
    notification_id
    created_at
    updated_at
    title
  }
`;

export const notificationAcapelaEntity = defineEntity<NotificationAcapelaFragment>({
  name: "notification_acapela",
  updatedAtField: "updated_at",
  idField: "id",
  keys: getFragmentKeys<NotificationAcapelaFragment>(notificationAcapelaFragment),
  sync: createHasuraSyncSetupFromFragment<NotificationAcapelaFragment>(notificationAcapelaFragment),
});

export type NotificationAcapelaEntity = EntityByDefinition<typeof notificationAcapelaEntity>;
