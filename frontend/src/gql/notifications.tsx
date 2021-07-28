import { gql } from "@apollo/client";
import { createFragment, createMutation, createQuery } from "./utils";
import {
  NotificationInfoFragment as NotificationInfoFragmentType,
  NotificationsQuery,
  NotificationsQueryVariables,
  UnreadNotificationsQuery,
  UnreadNotificationsQueryVariables,
  MarkNotificationAsReadMutation,
  MarkNotificationAsReadMutationVariables,
} from "~gql";

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

export const [useNotifications] = createQuery<NotificationsQuery, NotificationsQueryVariables>(
  () => gql`
    ${NotificationInfoFragment()}

    query Notifications {
      notification {
        ...NotificationInfo
      }
    }
  `
);

export const [useUnreadNotifications] = createQuery<UnreadNotificationsQuery, UnreadNotificationsQueryVariables>(
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

export const [useMarkNotificationAsUnread, { mutate: markNotificationAsUnread }] = createMutation<
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
