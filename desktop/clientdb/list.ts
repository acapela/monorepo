import gql from "graphql-tag";
import { isEqual } from "lodash";
import { observable } from "mobx";

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
import { FiltersInput, getIsItemMatchingFilters } from "@aca/shared/filters";
import { EntityByDefinition, cachedComputed, defineEntity } from "@acapela/clientdb";
import { EntityDataByDefinition } from "@acapela/clientdb";

import { NotificationEntity, notificationEntity } from "./notification";

type NotificationInnerDataUnion = EntityDataByDefinition<typeof innerEntities[number]> & { id: string };

type FiltersUnion<U> = U extends infer T
  ? T extends { __typename: infer TN }
    ? {
        __typename: TN;
      } & FiltersInput<Omit<T, "__typename">>
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
    emoji
    system_id
    user_id
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
  idField: "id",
  keys: getFragmentKeys<NotificationListFragment>(notificationFragment),
  getDefaultValues: ({ getContextValue }) => ({
    __typename: "notification_list",
    user_id: getContextValue(userIdContext) ?? undefined,
    notifications_interval_ms: null,
    emoji: null,
    system_id: null,
    seen_at: undefined,
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
      "emoji",
      "system_id",
    ],
    updateColumns: ["updated_at", "title", "filters", "notifications_interval_ms", "seen_at", "emoji"],
    upsertConstraint: "notification_filter_pkey",
  }),
}).addView((list, { db: { entity } }) => {
  const cachedGetIsNotificationPassingFilters = cachedComputed((notification: NotificationEntity) => {
    if (connections.typedFilters.length === 0) return false;

    const isPassing = getIsNotificationPassingFilters(notification, connections.typedFilters);

    return isPassing;
  });

  const notificationsDb = entity(notificationEntity);

  const resolvedNotificationsQuery = notificationsDb
    .query({ isResolved: true })
    .query(cachedGetIsNotificationPassingFilters);

  const notificationsWithReminderQuery = notificationsDb
    .query({ hasReminder: true, isResolved: false })
    .query(cachedGetIsNotificationPassingFilters);

  const inboxNotificationsQuery = notificationsDb
    .query({ isResolved: false, hasReminder: false, isSaved: false })
    .query(cachedGetIsNotificationPassingFilters);

  const inboxNotificationsSinceLastSeen = cachedComputed(() => {
    return inboxNotificationsQuery.query((notification) => {
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
    get resolvedNotifications() {
      return resolvedNotificationsQuery;
    },
    get notificationsWithReminder() {
      return notificationsWithReminderQuery;
    },
    get inboxNotifications() {
      return inboxNotificationsQuery;
    },
    get inboxNotificationsSinceLastSeen() {
      return inboxNotificationsSinceLastSeen();
    },
    get isSystemList() {
      if (list.system_id) return true;

      return false;
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

    return getIsItemMatchingFilters(notificationInner, actualFilter, true);
  }
);

export const getIsNotificationPassingFilters = cachedComputed(
  (notification: NotificationEntity, filters: NotificationFilter[]) => {
    const notificationInner = notification.inner;
    if (!notificationInner) return false;

    return filters.some((filter) => getIsNotificationPassingFilter(notification, filter));
  }
);
