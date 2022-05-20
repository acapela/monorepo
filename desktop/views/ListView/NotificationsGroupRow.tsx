import { motion } from "framer-motion";
import { uniq } from "lodash";
import { action } from "mobx";
import React, { useEffect, useMemo, useRef } from "react";
import styled, { css } from "styled-components";

import { toggleNotificationsGroup } from "@aca/desktop/actions/group";
import {
  copyNotificationLink,
  openFocusMode,
  resolveNotification,
  snoozeNotification,
  unresolveNotification,
  unsnoozeNotification,
} from "@aca/desktop/actions/notification";
import { useActionsContextMenu } from "@aca/desktop/domains/contextMenu/useActionsContextMenu";
import { PreviewLoadingPriority } from "@aca/desktop/domains/embed";
import { PreloadEmbed } from "@aca/desktop/domains/embed/PreloadEmbed";
import { NotificationsGroup } from "@aca/desktop/domains/group/group";
import { openedNotificationsGroupsStore } from "@aca/desktop/domains/group/openedStore";
import { NotificationAppIcon } from "@aca/desktop/domains/notification/NotificationAppIcon";
import { uiStore } from "@aca/desktop/store/ui";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { styledObserver } from "@aca/shared/component";
import { useDebouncedBoolean } from "@aca/shared/hooks/useDebouncedValue";
import { useUserFocusedOnElement } from "@aca/shared/hooks/useUserFocusedOnElement";
import { makeElementVisible } from "@aca/shared/interactionUtils";
import { pluralize } from "@aca/shared/text/pluralize";
import { IconChevronRight } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

import { NotificationDate } from "./NotificationDate";
import { UIUnreadIndicator } from "./NotificationRow";
import { NotificationsRows } from "./NotificationsRows";
import {
  UIAnimatedHighlight,
  UINotificationAppIcon,
  UINotificationGroupTitle,
  UINotificationPreviewText,
  UIRowQuickActions,
  UISendersLabel,
  UISnoozeLabel,
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
      [resolveNotification, unresolveNotification, snoozeNotification, unsnoozeNotification],
      [toggleNotificationsGroup, openFocusMode],
      [copyNotificationLink],
    ],
    group
  );

  const isFocused = uiStore.useFocus(group, (group) => group?.id);

  const isFocusedForAWhile = useDebouncedBoolean(isFocused, { onDelay: 200, offDelay: 0 });

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

  const isUnread: boolean = useMemo(() => {
    if (group.notifications.every((n) => n.isResolved)) {
      return false;
    }

    if (group.isOnePreviewEnough) {
      // We treat "one preview enough" notification groups as a single notification
      // So in this case, we won't display the unread indicator
      return group.notifications.every((n) => !n.last_seen_at);
    }
    return group.notifications.some((n) => !n.last_seen_at);
  }, [group]);

  useStoreRowVisibility(elementRef, group.id);

  return (
    <>
      <ActionTrigger
        {...(group.isOnePreviewEnough
          ? { action: openFocusMode, target: group }
          : { action: toggleNotificationsGroup, target: group })}
      >
        {/* This might be not super smart - we preload 5 notifications around focused one to have some chance of preloading it before you eg. click it */}
        {isFocusedForAWhile &&
          group.notifications.slice(0, 10).map((notificationToPreload, index) => {
            return (
              <PreloadEmbed
                priority={index === 0 ? PreviewLoadingPriority.next : PreviewLoadingPriority.following}
                key={notificationToPreload.id}
                url={notificationToPreload.url}
              />
            );
          })}
        <UIHolder ref={elementRef} $isFocused={isFocused}>
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
          <UITitle>
            {!group.isOnePreviewEnough && (
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
            {group.name && <UITitleText>{group.name}</UITitleText>}
            <UINotificationPreviewText>
              {group.notifications.find((n) => !!n.text_preview)?.text_preview}
            </UINotificationPreviewText>
          </UITitle>
          {!isFocused && group.notifications.some((n) => !n.isResolved) && (
            <UISnoozeLabel notificationOrGroup={group} />
          )}

          {isFocused && <UIRowQuickActions target={group} />}

          <NotificationDate notification={firstNotification} key={firstNotification.id} />
        </UIHolder>
        {!group.isOnePreviewEnough && isOpened && (
          <UINotifications>
            <NotificationsRows notifications={group.notifications} isBundledInGroup />
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

const UIHolder = styled.div<{ $isFocused: boolean }>`
  position: relative;
  ${theme.box.items.listRow.size.padding};

  ${NotificationAppIcon} {
    font-size: 24px;
  }
`;

const UITitle = styled(UINotificationGroupTitle)`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const UITitleText = styled.div`
  ${theme.common.ellipsisText}
`;

const UINotifications = styled.div`
  margin-left: 18px;
  padding-left: 20px;
  border-left: 2px solid ${theme.colors.layout.divider};
`;

const UICountIndicator = styled.div`
  ${theme.colors.panels.selectedTab.asBgWithReadableText};
  width: 24px;
  height: 24px;
  aspect-ratio: 1;
  ${theme.radius.circle};
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;

  ${(props) => {
    const children = props.children;

    if (typeof children !== "number" && typeof children !== "string") {
      return null;
    }

    const digitAsString = `${children}`;

    const digitsCount = digitAsString.length;

    if (digitsCount <= 1) return;

    if (digitsCount === 2) {
      return css`
        font-size: 0.8em;
        font-weight: bold;
      `;
    }

    return css`
      font-size: 0.66em;
      font-weight: bolder;
    `;
  }}
`;

const UIToggleIconAnimator = styled(motion.div)`
  font-size: 1.5em;
`;
