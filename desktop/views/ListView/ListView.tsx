import { observer } from "mobx-react";
import React, { useEffect } from "react";
import styled from "styled-components";

import { getIsNotificationsGroup } from "@aca/desktop/domains/group/group";
import { groupNotifications } from "@aca/desktop/domains/group/groupNotifications";
import { getInboxListsById } from "@aca/desktop/domains/list/all";
import { PreloadNotificationPreview } from "@aca/desktop/domains/notification/NotificationPreview";
import { PreviewLoadingPriority } from "@aca/desktop/domains/preview";
import { appViewContainerStyles } from "@aca/desktop/layout/Container";
import { TraySidebarLayout } from "@aca/desktop/layout/TraySidebarLayout/TraySidebarLayout";
import { uiStore } from "@aca/desktop/store/ui";
import { ListFilters } from "@aca/desktop/ui/Filters";
import { useDebouncedValue } from "@aca/shared/hooks/useDebouncedValue";
import { theme } from "@aca/ui/theme";

import { ListViewFooter } from "./ListViewFooter";
import { NotificationRow } from "./NotificationRow";
import { NotificationsGroupRow } from "./NotificationsGroupRow";
import { ListViewTopBar } from "./Topbar";
import { ListViewZenOverlay } from "./ZenMode";
import { ZeroNotifications } from "./ZeroNotifications";

interface Props {
  listId: string;
}

export const ListView = observer(({ listId }: Props) => {
  const displayedList = getInboxListsById(listId);
  const hasSettledFocusedTarget = useDebouncedValue(!!uiStore.focusedTarget, 100);

  const allNotifications = displayedList?.getAllNotifications() ?? [];

  const notificationGroups = allNotifications ? groupNotifications(allNotifications) : null;

  const isInCelebrationMode = uiStore.isDisplayingZenImage;

  useEffect(() => {
    if (!displayedList) return;

    displayedList.listEntity?.update({ seen_at: new Date().toISOString() });

    return () => {
      const list = displayedList.listEntity;
      if (list && !list.isRemoved()) {
        list.update({ seen_at: new Date().toISOString() });
      }
    };
  }, [displayedList]);

  useEffect(() => {
    if (isInCelebrationMode && allNotifications.length > 0) {
      uiStore.isDisplayingZenImage = false;
    }
  }, [isInCelebrationMode, allNotifications.length]);

  return (
    <TraySidebarLayout footer={<ListViewFooter />}>
      {isInCelebrationMode && (
        <UINotificationZeroHolder>
          <ListViewZenOverlay />
        </UINotificationZeroHolder>
      )}
      <ListViewTopBar list={displayedList ?? undefined} />
      <UIHolder>
        {displayedList?.isCustom && (
          <UIListTools>
            <ListFilters
              value={displayedList.listEntity?.typedFilters ?? []}
              onChange={(filters) => {
                displayedList?.listEntity?.update({ filters });
              }}
            />
          </UIListTools>
        )}

        <UIListsScroller>
          {displayedList && !isInCelebrationMode && (notificationGroups?.length ?? 0) === 0 && (
            <ZeroNotifications key={listId} />
          )}

          {displayedList && notificationGroups && notificationGroups.length > 0 && (
            <>
              {!hasSettledFocusedTarget &&
                displayedList.getNotificationsToPreload().map((notificationToPreload, index) => {
                  return (
                    <PreloadNotificationPreview
                      priority={index === 0 ? PreviewLoadingPriority.next : PreviewLoadingPriority.following}
                      key={notificationToPreload.id}
                      url={notificationToPreload.url}
                    />
                  );
                })}
              <UINotifications>
                {notificationGroups?.map((notificationOrGroup) => {
                  if (getIsNotificationsGroup(notificationOrGroup)) {
                    return (
                      <NotificationsGroupRow
                        list={displayedList}
                        key={notificationOrGroup.id}
                        group={notificationOrGroup}
                      />
                    );
                  }

                  return (
                    <NotificationRow
                      list={displayedList}
                      key={notificationOrGroup.id}
                      notification={notificationOrGroup}
                    />
                  );
                })}
              </UINotifications>
            </>
          )}
        </UIListsScroller>
      </UIHolder>
    </TraySidebarLayout>
  );
});

const UIHolder = styled.div<{}>`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  min-height: 0;
  position: relative;
`;

const UINotifications = styled.div`
  ${appViewContainerStyles};
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow-y: auto;

  padding-bottom: 48px;

  padding-top: 10px;
`;

const UINotificationZeroHolder = styled.div`
  position: absolute;
  display: block;
  inset: 0;
  display: flex;
  flex-direction: column;
  z-index: 100000;
  overflow: hidden;
`;

const UIListTools = styled.div`
  ${appViewContainerStyles};
  display: flex;
  min-width: 0;
  ${theme.spacing.actions.asGap}
  padding-right: 16px;
  align-items: flex-start;

  padding-top: 16px;

  ${ListFilters} {
    flex-grow: 1;
  }
`;

const UIListsScroller = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
`;
