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

import { notificationFigmaCommentEntity } from "./figma/comment";
import { notificationNotionEntity } from "./notion/baseNotification";
import { notificationSlackMessageEntity } from "./slack/message";

const notificationFragment = gql`
  fragment DesktopNotification on notification {
    id
    from
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

const innerEntities = [notificationNotionEntity, notificationSlackMessageEntity, notificationFigmaCommentEntity];

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
      insertColumns: ["id", "created_at", "resolved_at", "updated_at", "url", "user_id", "from"],
      updateColumns: ["updated_at", "url", "resolved_at"],
      upsertConstraint: "notification_pkey",
    }
  ),
}).addConnections((notification, { getEntity }) => {
  const connections = {
    get inner(): undefined | EntityByDefinition<typeof innerEntities[number]> {
      return (
        innerEntities
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((entity) => getEntity(entity as any).query({ notification_id: notification.id }).first)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .find(Boolean) as any
      );
    },
    get kind() {
      return connections.inner?.__typename ?? null;
    },
  };

  return connections;
});

export type NotificationEntity = EntityByDefinition<typeof notificationEntity>;
