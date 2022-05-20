import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { userIdContext } from "@aca/clientdb/utils/context";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import {
  NotificationStatusLabelFragment,
  Notification_Status_Label_Bool_Exp,
  Notification_Status_Label_Constraint,
  Notification_Status_Label_Insert_Input,
  Notification_Status_Label_Set_Input,
} from "@aca/gql";

import { notificationStatusEntity } from "./notificationStatus";

const notificationStatusLabelFragment = gql`
  fragment NotificationStatusLabel on notification_status_label {
    id
    name
    user_id
    order
    updated_at
    created_at
  }
`;

type NotificationStatusLabelConstraints = {
  key: Notification_Status_Label_Constraint;
  insert: Notification_Status_Label_Insert_Input;
  update: Notification_Status_Label_Set_Input;
  where: Notification_Status_Label_Bool_Exp;
};

export const notificationStatusLabelEntity = defineEntity<NotificationStatusLabelFragment>({
  name: "notification_status_label",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<NotificationStatusLabelFragment>(notificationStatusLabelFragment),
  getDefaultValues: ({ getContextValue }) => ({
    __typename: "notification_status_label",
    user_id: getContextValue(userIdContext) ?? undefined,
    order: "A",
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<NotificationStatusLabelFragment, NotificationStatusLabelConstraints>(
    notificationStatusLabelFragment,
    {
      updateColumns: ["name", "order"],
      upsertConstraint: "notification_status_label_pkey",
      insertColumns: ["id", "name", "order"],
    }
  ),
}).addEventHandlers({
  itemRemoved(label, { getEntity }) {
    console.log("removed");
    getEntity(notificationStatusEntity)
      .find({ status_label_id: label.id })
      .forEach((statusWithThisLabel) => {
        console.log("go remove");
        statusWithThisLabel.remove();
      });
  },
});

export type NotificationStatusLabelEntity = EntityByDefinition<typeof notificationStatusLabelEntity>;
