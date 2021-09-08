import { gql } from "@apollo/client";

import {
  DeleteAllReadNotificationsMutation,
  DeleteAllReadNotificationsMutationVariables,
  MarkAllNotificationsAsReadMutation,
  MarkAllNotificationsAsReadMutationVariables,
  MarkNotificationAsReadMutation,
  MarkNotificationAsReadMutationVariables,
  NotificationInfoFragment as NotificationInfoFragmentType,
  NotificationsQuery,
  NotificationsQueryVariables,
  RemoveNotificationMutation,
  RemoveNotificationMutationVariables,
  UnreadNotificationsQuery,
  UnreadNotificationsQueryVariables,
} from "~gql";

import { createFragment, createMutation, createQuery } from "./utils";

const NotificationInfoFragment = createFragment<NotificationInfoFragmentType>(
  () => gql`
    fragment NotificationInfo on notification {
      id
      created_at
      data
      read_at
    }
  `
);

export const [useNotifications, notificationsQueryManager] = createQuery<
  NotificationsQuery,
  NotificationsQueryVariables
>(
  () => gql`
    ${NotificationInfoFragment()}

    query Notifications {
      notification {
        ...NotificationInfo
      }
    }
  `
);

export const [useUnreadNotifications, unreadNotificationsQueryManager] = createQuery<
  UnreadNotificationsQuery,
  UnreadNotificationsQueryVariables
>(
  () => gql`
    ${NotificationInfoFragment()}

    query UnreadNotifications {
      notification(where: { read_at: { _is_null: true } }) {
        ...NotificationInfo
      }
    }
  `
);

export const [useMarkNotificationAsRead, { mutate: markNotificationAsRead }] = createMutation<
  MarkNotificationAsReadMutation,
  MarkNotificationAsReadMutationVariables
>(
  () => gql`
    ${NotificationInfoFragment()}
    mutation MarkNotificationAsRead($id: uuid!, $date: timestamptz) {
      update_notification(where: { id: { _eq: $id } }, _set: { read_at: $date }) {
        returning {
          ...NotificationInfo
        }
      }
    }
  `,
  {
    defaultVariables() {
      return {
        date: new Date().toISOString(),
      };
    },
    optimisticResponse({ id, date }) {
      const originalData = NotificationInfoFragment.assertRead(id);
      return {
        __typename: "mutation_root",
        update_notification: {
          __typename: "notification_mutation_response",
          returning: [
            {
              ...originalData,
              read_at: date,
            },
          ],
        },
      };
    },
  }
);

export const [useRemoveNotification, { mutate: removeNotification }] = createMutation<
  RemoveNotificationMutation,
  RemoveNotificationMutationVariables
>(
  () => gql`
    ${NotificationInfoFragment()}
    mutation RemoveNotification($id: uuid!) {
      delete_notification_by_pk(id: $id) {
        ...NotificationInfo
      }
    }
  `
);

export const [useMarkAllNotificationsAsRead, { mutate: markAllNotificationsAsRead }] = createMutation<
  MarkAllNotificationsAsReadMutation,
  MarkAllNotificationsAsReadMutationVariables
>(
  () => gql`
    ${NotificationInfoFragment()}
    mutation MarkAllNotificationsAsRead($date: timestamptz) {
      update_notification(where: { read_at: { _is_null: true } }, _set: { read_at: $date }) {
        returning {
          ...NotificationInfo
        }
      }
    }
  `,
  {
    defaultVariables() {
      return {
        date: new Date().toISOString(),
      };
    },
  }
);

export const [, { mutate: deleteAllReadNotifications }] = createMutation<
  DeleteAllReadNotificationsMutation,
  DeleteAllReadNotificationsMutationVariables
>(
  () => gql`
    ${NotificationInfoFragment()}
    mutation DeleteAllReadNotifications {
      delete_notification(where: { read_at: { _is_null: false } }) {
        affected_rows
      }
    }
  `
);

export const [, { mutate: markNotificationAsUnread }] = createMutation<
  MarkNotificationAsReadMutation,
  MarkNotificationAsReadMutationVariables
>(
  () => gql`
    ${NotificationInfoFragment()}
    mutation MarkNotificationAsUnread($id: uuid!) {
      update_notification(where: { id: { _eq: $id } }, _set: { read_at: null }) {
        returning {
          ...NotificationInfo
        }
      }
    }
  `,
  {
    defaultVariables() {
      return {
        date: new Date().toISOString(),
      };
    },
    optimisticResponse({ id }) {
      const originalData = NotificationInfoFragment.assertRead(id);
      return {
        __typename: "mutation_root",
        update_notification: {
          __typename: "notification_mutation_response",
          returning: [
            {
              ...originalData,
              read_at: null,
            },
          ],
        },
      };
    },
  }
);
