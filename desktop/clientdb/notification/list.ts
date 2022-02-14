import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { userIdContext } from "@aca/clientdb/utils/context";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import { innerEntities } from "@aca/desktop/clientdb/notification/inner";
import {
  NotificationListFragment,
  Notification_List_Bool_Exp,
  Notification_List_Constraint,
  Notification_List_Insert_Input,
  Notification_List_Set_Input,
} from "@aca/gql";

type WithFilters<T extends { __typename: string }> = { kind: T["__typename"] } & {
  [Key in keyof Omit<T, "__typename">]?: T[Key] | { $in: T[Key][] } | { $not: T[Key] | { $in: T[Key][] } };
};
export type NotificationFilter = WithFilters<EntityByDefinition<typeof innerEntities[number]>>;

const notificationFragment = gql`
  fragment NotificationList on notification_list {
    id
    updated_at
    created_at
    title
    filters
  }
`;

type NotificationListConstraints = {
  key: Notification_List_Constraint;
  insert: Notification_List_Insert_Input;
  update: Notification_List_Set_Input;
  where: Notification_List_Bool_Exp;
};

export const notificationListEntity = defineEntity<NotificationListFragment>({
  name: "notification_list",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<NotificationListFragment>(notificationFragment),
  getDefaultValues: ({ getContextValue }) => ({
    __typename: "notification_list",
    user_id: getContextValue(userIdContext) ?? undefined,
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<NotificationListFragment, NotificationListConstraints>(notificationFragment, {
    insertColumns: ["id", "created_at", "updated_at", "user_id", "title", "filters"],
    updateColumns: ["updated_at", "title", "filters"],
    upsertConstraint: "notification_filter_pkey",
  }),
}).addConnections((list) => ({
  get typedFilters(): NotificationFilter[] {
    return Array.isArray(list.filters) ? list.filters : [];
  },
}));

export type NotificationListEntity = EntityByDefinition<typeof notificationListEntity>;
