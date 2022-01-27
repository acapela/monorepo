import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { PreloadBrowserView } from "@aca/desktop/BrowserViewBridge";
import { useUnresolvedNotifications } from "@aca/desktop/hooks/useUnresolvedNotifications";
import { TraySidebarLayout } from "@aca/desktop/layout/TraySidebarLayout/TraySidebarLayout";
import { desktopRouter } from "@aca/desktop/routes";

import { ListsTabBar } from "./ListsTabBar";

interface Props {
  listId: string;
}

export const ListView = observer(({ listId }: Props) => {
  const unresolvedNotifications = useUnresolvedNotifications();
  return (
    <TraySidebarLayout>
      <UITabsBar>
        <ListsTabBar activeListId={listId} />
      </UITabsBar>
      Active list {listId}
      {unresolvedNotifications.map((notification, i) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const innerNotification = notification.inner!;
        return (
          <React.Fragment key={notification.id}>
            {/*  We only preload the first 5 notifications' web-views to limit resource usage */}
            {i < 5 && <PreloadBrowserView url={notification.url} />}
            <button
              onClick={() => {
                desktopRouter.navigate("focus", { notificationId: notification.id });
              }}
              style={{ display: "block", padding: 5, margin: 10, cursor: "pointer", width: "100%" }}
            >
              {innerNotification.__typename == "notification_slack_message"
                ? `${notification.from} in ${innerNotification?.conversation_name}`
                : `${notification.from} in ${innerNotification.notion_page_title}`}
            </button>
          </React.Fragment>
        );
      })}
    </TraySidebarLayout>
  );
});

const UITabsBar = styled.div`
  padding-top: 2px;
  padding-bottom: 24px;
`;
