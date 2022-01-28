import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { PreloadBrowserView } from "@aca/desktop/BrowserViewBridge";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { unresolvedNotificationsComputed } from "@aca/desktop/hooks/useUnresolvedNotifications";
import { TraySidebarLayout } from "@aca/desktop/layout/TraySidebarLayout/TraySidebarLayout";
import { desktopRouter } from "@aca/desktop/routes";

import { ListsTabBar } from "./ListsTabBar";

interface Props {
  listId: string;
}

function getNotificationTitle(notification: NotificationEntity): string {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const innerNotification = notification.inner!;
  const type = innerNotification.__typename;

  switch (type) {
    case "notification_slack_message": {
      return `${notification.from} in ${innerNotification?.conversation_name}`;
    }
    case "notification_notion": {
      switch (innerNotification.type) {
        case "notification_notion_commented":
          return `${notification.from} left a comment in ${innerNotification?.page_title}`;
        case "notification_notion_user_invited":
          return `${notification.from} invited you to ${innerNotification?.page_title}`;
        case "notification_notion_user_mentioned":
          return `${notification.from} mentioned you to ${innerNotification?.page_title}`;
        default:
          return "New Notion notification";
      }
    }
    case "notification_figma_comment": {
      return `${notification.from} ${innerNotification.is_mention ? "mentioned you" : "commented"} in ${
        innerNotification?.file_name
      }`;
    }
    default:
      return "Unhandled notification!!";
  }
}

export const ListView = observer(({ listId }: Props) => {
  const unresolvedNotifications = unresolvedNotificationsComputed.get();
  return (
    <TraySidebarLayout>
      <UITabsBar>
        <ListsTabBar activeListId={listId} />
      </UITabsBar>
      Active list {listId}
      {unresolvedNotifications.map((notification, i) => {
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
              {getNotificationTitle(notification)}
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
