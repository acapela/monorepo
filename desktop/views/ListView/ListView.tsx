import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { getIsNotificationsGroup } from "@aca/desktop/domains/group/group";
import { groupNotifications } from "@aca/desktop/domains/group/groupNotifications";
import { getPredefinedListById } from "@aca/desktop/domains/list/preconfigured";
import { PreloadNotificationEmbed } from "@aca/desktop/domains/notification/NotificationEmbedView";
import { TraySidebarLayout } from "@aca/desktop/layout/TraySidebarLayout/TraySidebarLayout";

import { ListsTabBar } from "./ListsTabBar";
import { ListViewFooter } from "./ListViewFooter";
import { NotificationRow } from "./NotificationRow";
import { NotificationsGroupRow } from "./NotificationsGroupRow";

interface Props {
  listId: string;
}

export const ListView = observer(({ listId }: Props) => {
  const list = getPredefinedListById(listId);

  const allNotifications = list?.getAllNotifications().all;

  const notificationGroups = allNotifications ? groupNotifications(allNotifications) : null;

  return (
    <TraySidebarLayout footer={<ListViewFooter />}>
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
            {notificationGroups?.map((notificationOrGroup) => {
              if (getIsNotificationsGroup(notificationOrGroup)) {
                return <NotificationsGroupRow list={list} key={notificationOrGroup.id} group={notificationOrGroup} />;
              }

              return <NotificationRow list={list} key={notificationOrGroup.id} notification={notificationOrGroup} />;
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
  padding-right: 15px;
  padding-bottom: 16px;
`;

const UITabsBar = styled.div`
  padding-top: 2px;
  padding-bottom: 24px;
`;
