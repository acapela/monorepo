import { useEffect } from "react";

import { removeNotification } from "~frontend/gql/notifications";
import { NotificationInfoFragment } from "~gql";

interface UseRemoveIncorrectNotificationInput {
  isLoading: boolean;
  shouldRemove: boolean;
  notification: NotificationInfoFragment;
}

/**
 * Will automatically remove notification if provided condition is true.
 *
 * It is a drawback of our current notifications data shape.
 *
 * Notification data is saved as type-safe json. This however is not strictly relational data, so it is possible that
 * this JSON points to not existing entity.
 *
 * Example scenario:
 *
 * You're mentioned in topic abc
 * Notification is created with {topicId: "abc"}
 * Later on topic is removed
 * Topic "abc" no longer exists
 * Notification still points to it resulting in not being able to fetch the needed data.
 *
 * - - - - -
 *
 * Solution to this problem would be creating strict table relations with cascades in notifications.
 *
 * While it would solve this problem described above, it would make data structure itself way more complex to manage (which is maybe worth it?)
 *
 * eg. with columns baked into notification at SQL level it is easy to introduce inconsistent data:
 *
 * notification data is strongly depending on notification type: eg. "topic mention" type requires topicId and mentioningUserId and it it currently type safe.
 *
 * With columns we'd probably need every possible relation being nullable as SQL is not able to link 'nullability' with notification type.
 *
 *
 */
export function useRemoveIncorrectNotification({
  isLoading,
  notification,
  shouldRemove,
}: UseRemoveIncorrectNotificationInput) {
  useEffect(() => {
    if (isLoading) return;

    if (!shouldRemove) return;

    removeNotification({ id: notification.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, shouldRemove]);
}
