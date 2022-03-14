import gql from "graphql-tag";
import { isEqual } from "lodash";
import { observable } from "mobx";

import { EntityByDefinition, cachedComputed, defineEntity } from "@aca/clientdb";
import { EntityDataByDefinition } from "@aca/clientdb/entity/definition";
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
import { FiltersData, getIsItemMatchingFilters } from "@aca/shared/filters";

import { NotificationEntity, notificationEntity } from "./notification";

type NotificationInnerDataUnion = EntityDataByDefinition<typeof innerEntities[number]> & { id: string };

type FiltersUnion<U> = U extends infer T
  ? T extends { __typename: infer TN }
    ? {
        __typename: TN;
      } & FiltersData<Omit<T, "__typename">>
    : never
  : never;

export type NotificationFilter = FiltersUnion<NotificationInnerDataUnion>;

const notificationFragment = gql`
  fragment NotificationList on notification_list {
    id
    updated_at
    created_at
    title
    filters
    notifications_interval_ms
    seen_at
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
    user_id: getContextValue(userIdContext) ?? null,
    notifications_interval_ms: null,
    filters: [],
    ...getGenericDefaultData(),
  }),
  customObservableAnnotations: {
    filters: observable.ref,
  },
  sync: createHasuraSyncSetupFromFragment<NotificationListFragment, NotificationListConstraints>(notificationFragment, {
    insertColumns: [
      "id",
      "created_at",
      "updated_at",
      "user_id",
      "title",
      "filters",
      "notifications_interval_ms",
      "seen_at",
    ],
    updateColumns: ["updated_at", "title", "filters", "notifications_interval_ms", "seen_at"],
    upsertConstraint: "notification_filter_pkey",
  }),
}).addConnections((list, { getEntity }) => {
  const cachedGetIsNotificationPassingFilters = cachedComputed((notification: NotificationEntity) => {
    return getIsNotificationPassingFilters(notification, connections.typedFilters);
  });

  const passingNotifications = cachedComputed(
    () => {
      if (connections.typedFilters.length === 0) {
        return getEntity(notificationEntity).query({
          // TODO: did it for type-safety. We should probably have .emptyQuery
          // I used simpleQuery for speed (instead of () => false) query
          id: "NO_EXISTING",
        });
      }

      return getEntity(notificationEntity).query(cachedGetIsNotificationPassingFilters);
    },
    { debugId: "passingNotifications" }
  );

  const inboxNotifications = cachedComputed(
    () => {
      return passingNotifications().query({ isResolved: false, isSnoozed: false });
    },
    { debugId: "inboxNotifications" }
  );

  const inboxNotificationsSinceLastSeen = cachedComputed(() => {
    return inboxNotifications().query((notification) => {
      return new Date(notification.updated_at) > new Date(list.seen_at);
    });
  });

  const getFilters = cachedComputed(
    (): NotificationFilter[] => {
      return Array.isArray(list.filters) ? list.filters : [];
    },
    { equals: isEqual }
  );

  const connections = {
    get typedFilters(): NotificationFilter[] {
      return getFilters();
    },
    get notifications() {
      return passingNotifications();
    },
    get inboxNotifications() {
      return inboxNotifications();
    },
    get inboxNotificationsSinceLastSeen() {
      return inboxNotificationsSinceLastSeen();
    },
    // Notifications that we never notified user about
    // TODO: Name is weird
    get notificationsToNotifyUserAbout() {
      return inboxNotificationsSinceLastSeen().query({ notified_user_at: null });
    },
  };

  return connections;
});

export type NotificationListEntity = EntityByDefinition<typeof notificationListEntity>;

const getIsNotificationPassingFilter = cachedComputed(
  (notification: NotificationEntity, filter: NotificationFilter) => {
    const notificationInner = notification.inner;
    if (!notificationInner) return false;

    const { id, ...actualFilter } = filter;
    id;

    return getIsItemMatchingFilters(notificationInner, actualFilter);
  }
);

export const getIsNotificationPassingFilters = cachedComputed(
  (notification: NotificationEntity, filters: NotificationFilter[]) => {
    const notificationInner = notification.inner;
    if (!notificationInner) return false;

    return filters.some((filter) => getIsNotificationPassingFilter(notification, filter));
  }
);
