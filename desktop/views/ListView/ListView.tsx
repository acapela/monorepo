import { observer } from "mobx-react";
import React, { useEffect } from "react";
import styled from "styled-components";

import { getIsNotificationsGroup } from "@aca/desktop/domains/group/group";
import { groupNotifications } from "@aca/desktop/domains/group/groupNotifications";
import { getInboxLists, getInboxListsById, isInboxList, outOfInboxLists } from "@aca/desktop/domains/list/all";
import { PreloadNotificationPreview } from "@aca/desktop/domains/notification/NotificationPreview";
import { PreviewLoadingPriority } from "@aca/desktop/domains/preview";
import { TraySidebarLayout } from "@aca/desktop/layout/TraySidebarLayout/TraySidebarLayout";
import { uiStore } from "@aca/desktop/store/ui";
import { useDebouncedValue } from "@aca/shared/hooks/useDebouncedValue";
import { HorizontalScroller } from "@aca/ui/HorizontalScroller";
import { theme } from "@aca/ui/theme";

import { ListEditTools } from "./EditTools";
import { ListFilters } from "./Filters";
import { ListsTabBar } from "./ListsTabBar";
import { ListViewFooter } from "./ListViewFooter";
import { NotificationRow } from "./NotificationRow";
import { NotificationsGroupRow } from "./NotificationsGroupRow";
import { ZeroNotifications } from "./ZeroNotifications";

interface Props {
  listId: string;
}

export const ListView = observer(({ listId }: Props) => {
  const displayedList = getInboxListsById(listId);
  const hasSettledFocusedTarget = useDebouncedValue(!!uiStore.focusedTarget, 100);

  const listsToDisplay = isInboxList(displayedList?.id ?? "") ? getInboxLists() : outOfInboxLists;

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
      <UIHolder>
        <UITabsBar>
          <ListsTabBar activeListId={listId} lists={listsToDisplay} />
        </UITabsBar>
        {displayedList?.isCustom && (
          <UIListTools>
            <ListFilters listId={listId} />
            <ListEditTools listId={listId} />
          </UIListTools>
        )}

        {isInCelebrationMode ? (
          <UINotificationZeroHolder>
            <UINotificationZeroPanel>You've reached notification zero.</UINotificationZeroPanel>
          </UINotificationZeroHolder>
        ) : (
          <UIListsScroller>
            {displayedList && (notificationGroups?.length ?? 0) === 0 && <ZeroNotifications key={listId} />}

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
        )}
      </UIHolder>
    </TraySidebarLayout>
  );
});

const UIHolder = styled.div<{}>`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  min-height: 0;
`;

const UINotifications = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow-y: auto;

  padding-right: 15px;
  padding-bottom: 48px;

  margin-top: 20px;
  padding-top: 10px;
`;

const UITabsBar = styled(HorizontalScroller)`
  margin-right: 16px;
`;

const UINotificationZeroHolder = styled.div`
  position: absolute;
  display: block;

  left: 90px;
  bottom: 200px;
`;

const UINotificationZeroPanel = styled.div`
  height: 60px;
  width: 300px;
  align-items: center;
  justify-content: center;
  text-align: center;
  display: inline-flex;
  ${theme.colors.layout.background.opacity(0.7).asBg};
  backdrop-filter: blur(16px);
  ${theme.radius.primaryItem}
`;

const UIListTools = styled.div`
  display: flex;
  min-width: 0;
  ${theme.spacing.actions.asGap}
  padding-right: 16px;
  align-items: flex-start;

  padding-top: 16px;

  ${ListFilters} {
    flex-grow: 1;
  }

  ${ListEditTools} {
    padding-top: 4px;
  }
`;

const UIListsScroller = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
`;
