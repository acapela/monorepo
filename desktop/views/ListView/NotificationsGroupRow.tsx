import { motion } from "framer-motion";
import { uniq } from "lodash";
import { action, computed } from "mobx";
import React, { useEffect, useRef } from "react";
import styled, { css } from "styled-components";

import { toggleNotificationsGroup } from "@aca/desktop/actions/group";
import {
  addReminderToNotification,
  cancelSaveNotification,
  copyNotificationLink,
  openFocusMode,
  removeNotificationReminder,
  resolveNotification,
  saveNotification,
  unresolveNotification,
} from "@aca/desktop/actions/notification";
import { PreloadingState, preloadingPreviewsBridgeChannel } from "@aca/desktop/bridge/preview";
import { useActionsContextMenu } from "@aca/desktop/domains/contextMenu/useActionsContextMenu";
import { devSettingsStore } from "@aca/desktop/domains/dev/store";
import { PreviewLoadingPriority } from "@aca/desktop/domains/embed";
import { PreloadEmbed } from "@aca/desktop/domains/embed/PreloadEmbed";
import { NotificationsGroup, getNotificationsGroupMeta } from "@aca/desktop/domains/group/group";
import { openedNotificationsGroupsStore } from "@aca/desktop/domains/group/openedStore";
import { NotificationAppIcon } from "@aca/desktop/domains/notification/NotificationAppIcon";
import { uiStore } from "@aca/desktop/store/ui";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { UICountIndicator } from "@aca/desktop/ui/CountIndicator";
import { styledObserver } from "@aca/shared/component";
import { useDebouncedBoolean } from "@aca/shared/hooks/useDebouncedValue";
import { useUserFocusedOnElement } from "@aca/shared/hooks/useUserFocusedOnElement";
import { makeElementVisible } from "@aca/shared/interactionUtils";
import { pluralize } from "@aca/shared/text/pluralize";
import { IconChevronRight } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

import { NotificationDate } from "./NotificationDate";
import { NotificationsRows } from "./NotificationsRows";
import { NotificationTags } from "./NotificationTags";
import {
  UIAnimatedHighlight,
  UINotificationAppIcon,
  UINotificationGroupTitle,
  UIReminderLabel,
  UIRowQuickActions,
  UISendersLabel,
  UIUnreadIndicator,
  useStoreRowVisibility,
} from "./shared";

interface Props {
  group: NotificationsGroup;
}

export const NotificationsGroupRow = styledObserver(({ group }: Props) => {
  const elementRef = useRef<HTMLDivElement>(null);

  const isOpened = openedNotificationsGroupsStore.getIsOpened(group.id);

  useActionsContextMenu(
    elementRef,
    [
      [resolveNotification, unresolveNotification, addReminderToNotification, removeNotificationReminder],
      [saveNotification, cancelSaveNotification],
      [toggleNotificationsGroup, openFocusMode],
      [copyNotificationLink],
    ],
    group
  );

  const isFocused = uiStore.useFocus(group, (group) => group?.id);

  const isFocusedForAWhile = useDebouncedBoolean(isFocused, { onDelay: 75, offDelay: 0 });

  useEffect(() => {
    if (!isFocused) return;
    makeElementVisible(elementRef.current);

    return action(() => {
      if (uiStore.focusedTarget === group) {
        uiStore.focusedTarget = null;
      }
    });
  }, [isFocused, group]);

  useUserFocusedOnElement(
    elementRef,
    action(() => {
      uiStore.focusedTarget = group;
    }),
    action(() => {
      if (isFocused) {
        uiStore.focusedTarget = null;
      }
    })
  );

  const [firstNotification] = group.notifications;

  if (!firstNotification) {
    console.warn("Group without notifications?");
    return null;
  }

  const allPeople = uniq(group.notifications.map((notification) => notification.from));

  const isUnread: boolean = computed(() => {
    if (group.notifications.every((n) => n.isResolved)) {
      return false;
    }

    if (group.treatAsOneNotification) {
      // We treat "one preview enough" notification groups as a single notification
      // So in this case, we won't display the unread indicator
      return group.notifications.every((n) => !n.last_seen_at);
    }
    return group.notifications.some((n) => !n.last_seen_at);
  }).get();

  useStoreRowVisibility(elementRef, group.id);

  const { title, tags } = getNotificationsGroupMeta(group);

  return (
    <>
      <ActionTrigger
        {...(group.treatAsOneNotification
          ? { action: openFocusMode, target: group }
          : { action: toggleNotificationsGroup, target: group })}
      >
        {isFocusedForAWhile && (
          <PreloadEmbed
            priority={PreviewLoadingPriority.next}
            key={group.notifications[0].id}
            url={group.notifications[0].url}
          />
        )}

        <UIHolder
          ref={elementRef}
          $isFocused={isFocused}
          $preloadingState={
            devSettingsStore.debugPreloading && preloadingPreviewsBridgeChannel.get()[group.notifications[0].url]
          }
        >
          {isFocused && <UIAnimatedHighlight />}

          <UIUnreadIndicator $isUnread={isUnread} />
          <UINotificationAppIcon notification={firstNotification} displayUnreadNotification={isUnread} />
          <UISendersLabel data-tooltip={allPeople.length > 1 ? allPeople.join(", ") : undefined}>
            {allPeople.length === 1 && allPeople[0]}
            {allPeople.length > 1 && (
              <>
                <UISendersPerson>{allPeople[0]}</UISendersPerson>
                <UISendersMore>, {pluralize`${allPeople.length - 1} ${["other"]}`}</UISendersMore>
              </>
            )}
          </UISendersLabel>
          {tags && <NotificationTags tags={tags} />}
          <UITitle>
            {!group.treatAsOneNotification && (
              <UIToggleIconAnimator
                animate={{ rotateZ: isOpened ? `90deg` : `0deg` }}
                initial={{ rotateZ: isOpened ? `90deg` : `0deg` }}
              >
                <IconChevronRight />
              </UIToggleIconAnimator>
            )}
            <UICountIndicator data-tooltip={pluralize`${group.notifications.length} ${["notification"]} in this group`}>
              {group.notifications.length}
            </UICountIndicator>
            {title && <UITitleText>{title}</UITitleText>}
          </UITitle>
          {group.notifications.some((n) => !n.isResolved) && <UIReminderLabel notificationOrGroup={group} />}

          {isFocused && <UIRowQuickActions target={group} />}

          <NotificationDate notification={firstNotification} key={firstNotification.id} />
        </UIHolder>
        {!group.treatAsOneNotification && isOpened && (
          <UINotifications>
            <NotificationsRows notifications={group.notifications} />
          </UINotifications>
        )}
      </ActionTrigger>
    </>
  );
})``;

const UISendersPerson = styled.span`
  min-width: 0;
  ${theme.common.ellipsisText}
`;

const UISendersMore = styled.span``;

const UIHolder = styled.div<{ $isFocused: boolean; $preloadingState?: PreloadingState | false }>`
  position: relative;
  ${theme.box.items.listRow.size.padding};

  ${NotificationAppIcon} {
    ${theme.iconSize.item};
  }

  ${(props) => {
    const status = props.$preloadingState;

    if (!status) return null;

    function getColor() {
      if (status === "loading") return "orange";
      if (status === "error") return "red";
      return "green";
    }

    return css`
      outline: 1px solid ${getColor()};
      outline-offset: -1px;
    `;
  }}
`;

const UITitle = styled(UINotificationGroupTitle)`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const UITitleText = styled.div`
  opacity: 0.6;
  ${theme.common.ellipsisText};
`;

const UINotifications = styled.div`
  margin-left: 18px;
  padding-left: 20px;
  border-left: 2px solid ${theme.colors.layout.divider};
`;

const UIToggleIconAnimator = styled(motion.div)`
  ${theme.iconSize.item};
`;
