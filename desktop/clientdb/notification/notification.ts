import gql from "graphql-tag";

import { defineEntity } from "@aca/clientdb";
import { EntityByDefinition } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import { DesktopNotificationFragment } from "@aca/gql";
import { findAndMap } from "@aca/shared/array";

import { notificationSlackMentionEntity } from "./slack/mention";

const notificationFragment = gql`
  fragment DesktopNotification on notification {
    id
    title
    url
    resolved_at
    updated_at
    created_at
  }
`;

const notificationEntities = [notificationSlackMentionEntity];

export const notificationEntity = defineEntity<DesktopNotificationFragment>({
  name: "notification",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<DesktopNotificationFragment>(notificationFragment),
  getDefaultValues: () => ({
    __typename: "notification",
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<DesktopNotificationFragment>(notificationFragment),
}).addConnections((notification, { getEntity }) => ({
  get inner() {
    return findAndMap(
      notificationEntities,
      (entity) => getEntity(entity).query({ notification_id: notification.id }).first
    );
  },
}));

export type NotificationEntity = EntityByDefinition<typeof notificationEntity>;
