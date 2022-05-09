import { observer } from "mobx-react";
import React, { useEffect } from "react";
import styled from "styled-components";

import { deleteNotificationList, renameNotificationList } from "@aca/desktop/actions/lists";
import { getIsNotificationsGroup } from "@aca/desktop/domains/group/group";
import { getInboxListsById } from "@aca/desktop/domains/list/all";
import { ActionSystemMenuItem } from "@aca/desktop/domains/systemMenu/ActionSystemMenuItem";
import { appViewContainerStyles } from "@aca/desktop/layout/Container";
import { TraySidebarLayout } from "@aca/desktop/layout/TraySidebarLayout/TraySidebarLayout";
import { uiStore } from "@aca/desktop/store/ui";
import { ListFilters } from "@aca/desktop/ui/Filters";
import { ListViewPreloader } from "@aca/desktop/views/ListView/ListViewPreloader";
import { LazyChildrenRender } from "@aca/ui/performance/LazyChildrenRender";
import { theme } from "@aca/ui/theme";

import { ListViewFooter } from "./ListViewFooter";
import { NotificationRow } from "./NotificationRow";
import { NotificationsGroupRow } from "./NotificationsGroupRow";
import { ListViewTopBar } from "./Topbar";
import { NewListViewZenOverlay } from "./ZenMode/new";
import { ZeroNotifications } from "./ZeroNotifications";

interface Props {
  listId: string;
}

export const ListView = observer(({ listId }: Props) => {
  const list = getInboxListsById(listId);

  const notificationGroups = list?.getAllGroupedNotifications() ?? [];

  const isInCelebrationMode = uiStore.isDisplayingZenImage;

  useEffect(() => {
    if (!list) return;

    list.listEntity?.update({ seen_at: new Date().toISOString() });

    return () => {
      const listEntity = list.listEntity;
      if (listEntity && !listEntity.isRemoved()) {
        listEntity.update({ seen_at: new Date().toISOString() });
      }
    };
  }, [list]);

  useEffect(() => {
    if (isInCelebrationMode && notificationGroups.length > 0) {
      uiStore.isDisplayingZenImage = false;
    }
  }, [isInCelebrationMode, notificationGroups.length]);

  return (
    <TraySidebarLayout footer={<ListViewFooter />}>
      <ActionSystemMenuItem action={renameNotificationList} path={["List"]} target={list} />
      <ActionSystemMenuItem action={deleteNotificationList} path={["List"]} target={list} />

      {isInCelebrationMode && (
        <UINotificationZeroHolder>
          <NewListViewZenOverlay />
        </UINotificationZeroHolder>
      )}
      <ListViewTopBar key={list?.id} list={list ?? undefined} />
      <UIHolder>
        {list?.isCustom && (
          <UIListTools>
            <ListFilters
              value={list.listEntity?.typedFilters ?? []}
              onChange={(filters) => {
                list?.listEntity?.update({ filters });
              }}
            />
          </UIListTools>
        )}

        {list && <ListViewPreloader list={list} />}

        <UIListsScroller>
          {list && !isInCelebrationMode && (notificationGroups?.length ?? 0) === 0 && (
            <ZeroNotifications key={listId} />
          )}

          {list && notificationGroups && notificationGroups.length > 0 && (
            <UINotifications>
              <LazyChildrenRender initialCount={50} addBatchSize={50} batchInterval={100}>
                {notificationGroups?.map((notificationOrGroup) => {
                  if (getIsNotificationsGroup(notificationOrGroup)) {
                    return <NotificationsGroupRow key={notificationOrGroup.id} group={notificationOrGroup} />;
                  }

                  return <NotificationRow key={notificationOrGroup.id} notification={notificationOrGroup} />;
                })}
              </LazyChildrenRender>
            </UINotifications>
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
  ${theme.colors.layout.background.asBgWithReadableText};
`;

const UINotifications = styled.div`
  ${appViewContainerStyles};
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow-y: auto;

  padding-bottom: 192px;

  padding-top: 10px;
`;

const UINotificationZeroHolder = styled.div`
  position: absolute;
  display: block;
  inset: 0;
  display: flex;
  flex-direction: column;
  z-index: 2;
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
