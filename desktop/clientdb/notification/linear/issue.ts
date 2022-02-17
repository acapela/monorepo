import gql from "graphql-tag";

import { defineEntity } from "@aca/clientdb";
import { EntityByDefinition } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { NotificationLinearFragment } from "@aca/gql";

const notificationLinearFragment = gql`
  fragment NotificationLinear on notification_linear {
    id
    notification_id
    created_at
    updated_at
    type
    issue_id
    issue_title
    creator_id
    origin
  }
`;

export const notificationLinearEntity = defineEntity<NotificationLinearFragment>({
  name: "notification_linear",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<NotificationLinearFragment>(notificationLinearFragment),
  sync: createHasuraSyncSetupFromFragment<NotificationLinearFragment>(notificationLinearFragment),
});

export type NotificationLinearEntity = EntityByDefinition<typeof notificationLinearEntity>;
