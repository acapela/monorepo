import { isFuture } from "date-fns";
import gql from "graphql-tag";
import { action, createAtom } from "mobx";

import { EntityByDefinition, cachedComputed, defineEntity } from "@aca/clientdb";
import { EntityDataByDefinition } from "@aca/clientdb/entity/definition";
import { EntityQueryByDefinition } from "@aca/clientdb/entity/query";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { userIdContext } from "@aca/clientdb/utils/context";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import { trackEvent } from "@aca/desktop/analytics";
import { notificationResolvedChannel, notionNotificationResolvedChannel } from "@aca/desktop/bridge/notification";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import {
  DesktopNotificationFragment,
  Notification_Bool_Exp,
  Notification_Constraint,
  Notification_Insert_Input,
  Notification_Set_Input,
} from "@aca/gql";
import { IS_DEV } from "@aca/shared/dev";
import { autorunEffect } from "@aca/shared/mobx/utils";
import { createDateTimeout } from "@aca/shared/time";

import { notificationStatusEntity } from "../notificationStatus";
import { innerEntities } from "./inner";
import { NotificationNotionEntity } from "./notion/baseNotification";

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

export const getReverseTime = (timestamp: string) => -1 * new Date(timestamp).getTime();

export const notificationEntity = defineEntity<DesktopNotificationFragment>({
  name: "notification",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<DesktopNotificationFragment>(notificationFragment),
  // Show newest first
  defaultSort: (notification) => getReverseTime(notification.created_at),
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
  functionalFilterCheck: IS_DEV
    ? (notification, filter) => {
        if (notification.resolved_at) {
          console.warn(
            "You're using functional filter on resolved notification. It will be performance bottleneck. Use query({isResolved:true}).query(functionHere) instead to narrow it down first.",
            filter
          );
        }
      }
    : undefined,
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
  .addConnections((notification, { getEntity, updateSelf, refreshIndex, cleanup }) => {
    const getInner = cachedComputed((): EntityByDefinition<typeof innerEntities[number]> | undefined => {
      for (const entity of innerEntities) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = getEntity(entity as any).findFirst({ notification_id: notification.id });

        if (result) {
          return result as unknown as EntityByDefinition<typeof innerEntities[number]>;
        }
      }
    });

    const snoozePassedAtom = createAtom("Snooze change");

    const notificationStatus = getEntity(notificationStatusEntity);

    cleanup.next = autorunEffect(function handleSettingUpSnoozePassedSignal() {
      // Note: Not sure about this one
      if (notification.resolved_at) return;
      if (!notification.snoozed_until) return;

      const snoozeDate = new Date(notification.snoozed_until);

      return createDateTimeout(
        snoozeDate,
        action(() => {
          snoozePassedAtom.reportChanged();
          refreshIndex();
        })
      );
    });

    const connections = {
      get inner(): undefined | EntityByDefinition<typeof innerEntities[number]> {
        return getInner();
      },
      get kind() {
        return getInner()?.__typename ?? null;
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

      get status() {
        const status = notificationStatus.findFirst({ notification_id: notification.id });

        return status;
      },
      get statusLabel() {
        return connections.status?.label ?? null;
      },
      resolve() {
        if (notification.resolved_at) return;
        return updateSelf({ resolved_at: new Date().toISOString() });
      },
      markAsSeen() {
        return updateSelf({ last_seen_at: new Date().toISOString() });
      },

      get isSnoozed() {
        // Note: Not sure about this one
        if (notification.resolved_at) return false;
        if (!notification.snoozed_until) return false;

        const snoozeDate = new Date(notification.snoozed_until);

        const isStillSnoozed = isFuture(snoozeDate);

        snoozePassedAtom.reportObserved();

        return isStillSnoozed;
      },
      get canSnooze() {
        if (connections.isResolved) return false;
        if (connections.isSnoozed) return false;

        return true;
      },
      snooze(date: Date = new Date()) {
        if (!connections.canSnooze) return;

        return updateSelf({ snoozed_until: date.toISOString() });
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
      if (notificationInnerData.__typename === "notification_notion") {
        notionNotificationResolvedChannel.send((notification.inner as NotificationNotionEntity).resolveData());
      } else {
        notificationResolvedChannel.send({ notification: notificationData, inner: notificationInnerData });
      }
    },
  })
  .addAccessValidation((notification) => {
    if (!notification.inner) {
      log.debug(`No inner for entity ${notification.id}`);
      return false;
    }
    return true;
  });

export type NotificationEntity = EntityByDefinition<typeof notificationEntity>;

export type NotificationsQuery = EntityQueryByDefinition<typeof notificationEntity>;
