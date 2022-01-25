import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { userIdContext } from "@aca/clientdb/utils/context";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import {
  DesktopNotificationFragment,
  Notification_Bool_Exp,
  Notification_Constraint,
  Notification_Insert_Input,
  Notification_Set_Input,
} from "@aca/gql";
import { findAndMap } from "@aca/shared/array";

import { notificationSlackMentionEntity } from "./slack/mention";

const notificationFragment = gql`
  fragment DesktopNotification on notification {
    id
    url
    resolved_at
    updated_at
    created_at
  }
`;

type DesktopNotificationConstraints = {
  key: Notification_Constraint;
  insert: Notification_Insert_Input;
  update: Notification_Set_Input;
  where: Notification_Bool_Exp;
};

const notificationEntities = [notificationSlackMentionEntity];

export const notificationEntity = defineEntity<DesktopNotificationFragment>({
  name: "notification",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<DesktopNotificationFragment>(notificationFragment),
  getDefaultValues: ({ getContextValue }) => ({
    __typename: "notification",
    user_id: getContextValue(userIdContext) ?? undefined,
    resolved_at: null,
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<DesktopNotificationFragment, DesktopNotificationConstraints>(
    notificationFragment,
    {
      insertColumns: ["id", "created_at", "resolved_at", "updated_at", "url", "user_id"],
      updateColumns: ["updated_at", "url", "resolved_at"],
      upsertConstraint: "notification_pkey",
    }
  ),
}).addConnections((notification, { getEntity }) => ({
  get inner() {
    return findAndMap(
      notificationEntities,
      (entity) => getEntity(entity).query({ notification_id: notification.id }).first
    );
  },
}));

export type NotificationEntity = EntityByDefinition<typeof notificationEntity>;
