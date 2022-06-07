import gql from "graphql-tag";

import { defineEntity } from "@aca/clientdb";
import { EntityByDefinition } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { NotificationAcapelaFragment } from "@aca/gql";

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
  keyField: "id",
  keys: getFragmentKeys<NotificationAcapelaFragment>(notificationAcapelaFragment),
  sync: createHasuraSyncSetupFromFragment<NotificationAcapelaFragment>(notificationAcapelaFragment),
});

export type NotificationAcapelaEntity = EntityByDefinition<typeof notificationAcapelaEntity>;
