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
import { HStack } from "@aca/ui/Stack";
import { theme } from "@aca/ui/theme";

import { ListsTabBar } from "./ListsTabBar";
import { ListViewFooter } from "./ListViewFooter";
import { NotificationFilterForm } from "./NotificationFilterForm";
import { NotificationRow } from "./NotificationRow";
import { NotificationsGroupRow } from "./NotificationsGroupRow";
import { ZeroNotifications } from "./ZeroNotifications";

interface Props {
  listId: string;
  isEditing: boolean;
}

export const ListView = observer(({ listId, isEditing }: Props) => {
  const displayedList = getInboxListsById(listId);
  const hasSettledFocusedTarget = useDebouncedValue(!!uiStore.focusedTarget, 100);

  const listsToDisplay = isInboxList(displayedList?.id ?? "") ? getInboxLists() : outOfInboxLists;

  const allNotifications = displayedList?.getAllNotifications() ?? [];

  const notificationGroups = allNotifications ? groupNotifications(allNotifications) : null;

  const isInCelebrationMode = uiStore.isDisplayingZenImage;

  useEffect(() => {
    if (isInCelebrationMode && allNotifications.length > 0) {
      uiStore.isDisplayingZenImage = false;
    }
  }, [isInCelebrationMode, allNotifications.length]);

  return (
    <TraySidebarLayout footer={<ListViewFooter />}>
      <UITabsBar>
        <ListsTabBar activeListId={listId} lists={listsToDisplay} />
      </UITabsBar>

      {isInCelebrationMode ? (
        <UINotificationZeroHolder>
          <UINotificationZeroPanel>You've reached notification zero.</UINotificationZeroPanel>
        </UINotificationZeroHolder>
      ) : (
        <HStack style={{ height: "100%" }}>
          {isEditing && <NotificationFilterForm listId={listId} />}

          {displayedList && (notificationGroups?.length ?? 0) === 0 && <ZeroNotifications />}

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
        </HStack>
      )}
    </TraySidebarLayout>
  );
});

const UINotifications = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 0;
  overflow-y: auto;
  padding-right: 15px;
  /* Prevents the last notification in the list from hiding under the footer */
  padding-bottom: 60px;
`;

const UITabsBar = styled.div`
  padding-top: 2px;
  padding-bottom: 24px;
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
