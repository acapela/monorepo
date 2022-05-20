import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { userIdContext } from "@aca/clientdb/utils/context";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import {
  NotificationStatusFragment,
  Notification_Status_Bool_Exp,
  Notification_Status_Constraint,
  Notification_Status_Insert_Input,
  Notification_Status_Set_Input,
} from "@aca/gql";

import { notificationStatusLabelEntity } from "./notificationStatusLabel";

const notificationStatusFragment = gql`
  fragment NotificationStatus on notification_status {
    id
    notification_id
    status_label_id
    user_id
    order
    created_at
    updated_at
  }
`;

type NotificationStatusConstraints = {
  key: Notification_Status_Constraint;
  insert: Notification_Status_Insert_Input;
  update: Notification_Status_Set_Input;
  where: Notification_Status_Bool_Exp;
};

export const notificationStatusEntity = defineEntity<NotificationStatusFragment>({
  name: "notification_status",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<NotificationStatusFragment>(notificationStatusFragment),
  getDefaultValues: ({ getContextValue }) => ({
    __typename: "notification_status",
    user_id: getContextValue(userIdContext) ?? undefined,

    order: "AA",
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<NotificationStatusFragment, NotificationStatusConstraints>(
    notificationStatusFragment,
    {
      updateColumns: ["order"],
      insertColumns: ["id", "notification_id", "order", "status_label_id"],
      upsertConstraint: "notification_status_pkey",
    }
  ),
}).addConnections((status, { getEntity }) => {
  const notificationStatusLabel = getEntity(notificationStatusLabelEntity);
  return {
    get label() {
      return notificationStatusLabel.findFirst({ id: status.status_label_id });
    },
  };
});

export type NotificationStatusEntity = EntityByDefinition<typeof notificationStatusEntity>;
