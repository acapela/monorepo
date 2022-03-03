import { isPast } from "date-fns";
import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { EntityDataByDefinition } from "@aca/clientdb/entity/definition";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { userIdContext } from "@aca/clientdb/utils/context";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import { trackEvent } from "@aca/desktop/analytics";
import { notificationResolvedChannel } from "@aca/desktop/bridge/notification";
import { getIsNotificationPassingFilters } from "@aca/desktop/clientdb/list";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { accountStore } from "@aca/desktop/store/account";
import {
  DesktopNotificationFragment,
  Notification_Bool_Exp,
  Notification_Constraint,
  Notification_Insert_Input,
  Notification_Set_Input,
} from "@aca/gql";
import { mobxTickAt } from "@aca/shared/mobx/time";

import { innerEntities } from "./inner";

const notificationFragment = gql`
  fragment DesktopNotification on notification {
    id
    from
    url
    text_preview
    resolved_at
    updated_at
    created_at
    last_seen_at
    snoozed_until
    notified_user_at
  }
`;

type DesktopNotificationConstraints = {
  key: Notification_Constraint;
  insert: Notification_Insert_Input;
  update: Notification_Set_Input;
  where: Notification_Bool_Exp;
};

const log = makeLogger("Notification-Events");

export type NotificationInner = EntityDataByDefinition<typeof innerEntities[number]>;

export const notificationEntity = defineEntity<DesktopNotificationFragment>({
  name: "notification",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<DesktopNotificationFragment>(notificationFragment),
  defaultSort: (notification) => {
    // Show newest first
    return -1 * new Date(notification.created_at).getTime();
  },
  getDefaultValues: ({ getContextValue }) => ({
    __typename: "notification",
    user_id: getContextValue(userIdContext) ?? undefined,
    resolved_at: null,
    snoozed_until: null,
    text_preview: null,
    last_seen_at: null,
    notified_user_at: null,
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<DesktopNotificationFragment, DesktopNotificationConstraints>(
    notificationFragment,
    {
      insertColumns: [
        "id",
        "created_at",
        "resolved_at",
        "updated_at",
        "url",
        "user_id",
        "from",
        "snoozed_until",
        "text_preview",
        "last_seen_at",
        "notified_user_at",
      ],
      updateColumns: [
        "updated_at",
        "url",
        "resolved_at",
        "snoozed_until",
        "text_preview",
        "last_seen_at",
        "notified_user_at",
      ],
      upsertConstraint: "notification_pkey",
    }
  ),
})
  .addConnections((notification, { getEntity, updateSelf }) => {
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
      get isResolved() {
        return !!notification.resolved_at;
      },
      get isUnread() {
        if (notification.resolved_at) {
          return false;
        }
        return !notification.last_seen_at;
      },
      resolve() {
        if (notification.resolved_at) return;
        updateSelf({ resolved_at: new Date().toISOString() });
      },
      markAsSeen() {
        updateSelf({ last_seen_at: new Date().toISOString() });
      },

      get isSnoozed() {
        // Note: Not sure about this one
        if (notification.resolved_at) return false;
        if (!notification.snoozed_until) return false;

        const snoozeDate = new Date(notification.snoozed_until);

        if (isPast(snoozeDate)) return false;

        // If it is snoozed - force components or reactions using this information to re-render / re-run when this changes
        mobxTickAt(snoozeDate);

        return true;
      },
      get canSnooze() {
        if (connections.isResolved) return false;
        if (connections.isSnoozed) return false;

        return true;
      },
      snooze(date: Date = new Date()) {
        if (!connections.canSnooze) return;

        updateSelf({ snoozed_until: date.toISOString() });
      },
    };

    return connections;
  })
  .addEventHandlers({
    itemUpdated(notification, dataBefore) {
      const isResolvedNow = !dataBefore.resolved_at && notification.resolved_at;
      const isSnoozedNow = !dataBefore.snoozed_until && notification.snoozed_until;

      if (isResolvedNow) {
        trackEvent("Notification Resolved", { notification_id: notification.id });
      }

      if (isSnoozedNow) {
        trackEvent("Notification Snoozed", { notification_id: notification.id });
      }

      if (!isResolvedNow) return;

      if (!notification.inner) return;

      const notificationData = notification.getData();
      const notificationInnerData = notification.inner.getData();

      log.info(`Resolving Notification ${notification.id} of type ${notificationInnerData.__typename}`);
      notificationResolvedChannel.send({ notification: notificationData, inner: notificationInnerData });
    },
  })
  .addAccessValidation((notification) => {
    if (notification.inner) {
      const user = accountStore.assertUser;
      return (
        notification.kind !== "notification_slack_message" ||
        getIsNotificationPassingFilters(notification, user.importFilters)
      );
    } else {
      log.error(`No inner for entity ${notification.id}`);
      return false;
    }
  });

export type NotificationEntity = EntityByDefinition<typeof notificationEntity>;
