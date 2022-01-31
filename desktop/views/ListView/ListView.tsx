import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { getPredefinedListById } from "@aca/desktop/domains/list/preconfigured";
import { PreloadNotificationEmbed } from "@aca/desktop/domains/notification/NotificationEmbedView";
import { TraySidebarLayout } from "@aca/desktop/layout/TraySidebarLayout/TraySidebarLayout";

import { ListsTabBar } from "./ListsTabBar";
import { NotificationRow } from "./NotificationRow";

interface Props {
  listId: string;
}

export const ListView = observer(({ listId }: Props) => {
  const list = getPredefinedListById(listId);
  return (
    <TraySidebarLayout>
      <UITabsBar>
        <ListsTabBar activeListId={listId} />
      </UITabsBar>
      {!list && <>Unknown list</>}
      {list && (
        <>
          {list.getNotificationsToPreload().map((notificationToPreload) => {
            return <PreloadNotificationEmbed key={notificationToPreload.id} url={notificationToPreload.url} />;
          })}
          <UINotifications>
            {list.getAllNotifications().all.map((notification) => {
              return <NotificationRow list={list} key={notification.id} notification={notification} />;
            })}
          </UINotifications>
        </>
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
`;

const UITabsBar = styled.div`
  padding-top: 2px;
  padding-bottom: 24px;
`;
