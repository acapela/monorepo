import { motion } from "framer-motion";
import { uniq } from "lodash";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { toggleNotificationsGroup } from "@aca/desktop/actions/lists";
import { openFocusMode } from "@aca/desktop/actions/notification";
import { NotificationsGroup } from "@aca/desktop/domains/group/group";
import { openedNotificationsGroupsStore } from "@aca/desktop/domains/group/openedStore";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { NotificationAppIcon } from "@aca/desktop/domains/notification/NotificationAppIcon";
import { PreloadNotificationPreview } from "@aca/desktop/domains/notification/NotificationPreview";
import { PreviewLoadingPriority } from "@aca/desktop/domains/preview";
import { uiStore } from "@aca/desktop/store/ui";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { styledObserver } from "@aca/shared/component";
import { relativeShortFormatDate } from "@aca/shared/dates/format";
import { useDebouncedBoolean } from "@aca/shared/hooks/useDebouncedValue";
import { useUserFocusedOnElement } from "@aca/shared/hooks/useUserFocusedOnElement";
import { makeElementVisible } from "@aca/shared/interactionUtils";
import { mobxTicks } from "@aca/shared/mobx/time";
import { pluralize } from "@aca/shared/text/pluralize";
import { IconChevronRight } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

import { NotificationsRows } from "./NotificationsRows";
import { UINotificationGroupTitle, UISendersLabel } from "./shared";

interface Props {
  group: NotificationsGroup;
  list: NotificationsList;
}

export const NotificationsGroupRow = styledObserver(({ group, list }: Props) => {
  const elementRef = useRef<HTMLDivElement>(null);

  const isOpened = openedNotificationsGroupsStore.getIsOpened(group.id);

  mobxTicks.minute.reportObserved();

  const isFocused = uiStore.useFocus(group, (group) => group?.id);

  const isFocusedForAWhile = useDebouncedBoolean(isFocused, { onDelay: 200, offDelay: 0 });

  useEffect(() => {
    if (!isFocused) return;
    makeElementVisible(elementRef.current);

    return () => {
      if (uiStore.focusedTarget === group) {
        uiStore.focusedTarget = null;
      }
    };
  }, [isFocused, group]);

  useUserFocusedOnElement(
    elementRef,
    () => {
      uiStore.focusedTarget = group;
    },
    () => {
      if (isFocused) {
        uiStore.focusedTarget = null;
      }
    }
  );

  const [firstNotification] = group.notifications;

  if (!firstNotification) {
    console.warn("Group without notifications?");
    return null;
  }

  const allPeople = uniq(group.notifications.map((notification) => notification.from));

  return (
    <>
      <ActionTrigger
        {...(group.isOnePreviewEnough
          ? { action: openFocusMode, target: group.notifications[group.notifications.length - 1] }
          : { action: toggleNotificationsGroup, target: group })}
      >
        {/* This might be not super smart - we preload 5 notifications around focused one to have some chance of preloading it before you eg. click it */}
        {isFocusedForAWhile &&
          group.notifications.slice(0, 3).map((notificationToPreload, index) => {
            return (
              <PreloadNotificationPreview
                priority={index === 0 ? PreviewLoadingPriority.next : PreviewLoadingPriority.following}
                key={notificationToPreload.id}
                url={notificationToPreload.url}
              />
            );
          })}
        <UIHolder ref={elementRef} $isFocused={isFocused}>
          <NotificationAppIcon notification={firstNotification} />
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
            <UITitleText>{group.name}</UITitleText>
          </UITitle>
          <UIDate>{relativeShortFormatDate(new Date(firstNotification.created_at))}</UIDate>
        </UIHolder>
        {!group.isOnePreviewEnough && isOpened && (
          <UINotifications>
            <NotificationsRows notifications={group.notifications} list={list} />
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
  padding: 8px 8px;
  display: flex;
  align-items: center;
  gap: 24px;

  ${(props) => props.$isFocused && theme.colors.layout.backgroundAccent.asBg};

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

const UIDate = styled.div`
  opacity: 0.6;
`;

const UINotifications = styled.div`
  margin-left: 18px;
  padding-left: 20px;
  margin-top: 8px;
  margin-bottom: 8px;
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
`;

const UIToggleIconAnimator = styled(motion.div)`
  font-size: 1.5em;
`;
