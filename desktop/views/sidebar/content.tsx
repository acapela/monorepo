import { observer } from "mobx-react";
import React from "react";
import styled, { css } from "styled-components";

import { requestPreloadInMainWindow, requestPreviewInMainWindow } from "@aca/desktop/bridge/preview";
import { useDb } from "@aca/desktop/clientdb/ClientDbProvider";
import { desktopRouter } from "@aca/desktop/routes";
import { useAutorun } from "@aca/shared/sharedState";
import { Button } from "@aca/ui/buttons/Button";
import { phone } from "@aca/ui/responsive";
import { theme } from "@aca/ui/theme";

export const SidebarContent = observer(function SidebarContent() {
  const db = useDb();
  const unresolvedNotifications = db.notification.query({ resolved_at: null }).all;

  useAutorun(() => {
    for (const notification of unresolvedNotifications) {
      requestPreloadInMainWindow({ url: notification.url });
    }
  });

  return (
    <UIHolder>
      <UIHeader>
        <Button
          onClick={() => {
            desktopRouter.navigate("settings");
          }}
        >
          Show Settings
        </Button>
        <Button
          onClick={() => {
            desktopRouter.navigate("focus");
          }}
        >
          Focus
        </Button>
      </UIHeader>

      <UIRequestFeed>
        {unresolvedNotifications
          .filter((notification) => notification.inner)
          .map((notification) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const innerNotification = notification.inner!;
            return (
              <button
                key={notification.id}
                onClick={() => requestPreviewInMainWindow({ url: notification.url })}
                style={{ display: "block", padding: 5, margin: 10, cursor: "pointer", width: "100%" }}
              >
                {innerNotification.__typename == "notification_slack_message"
                  ? `${notification.from} in ${innerNotification?.conversation_name}`
                  : `${notification.from} in ${innerNotification.notion_page_title}`}
              </button>
            );
          })}
      </UIRequestFeed>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  width: 100%;
  height: 100%;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const primaryPaddingInSidebar = css`
  padding: 20px;
  ${phone(
    css`
      padding: 15px;
    `
  )}
`;

const UIHeader = styled.div<{}>`
  ${primaryPaddingInSidebar}
  display: flex;
  flex-direction: row;
  align-items: center;
  ${theme.spacing.actions.asGap}
`;

const UIRequestFeed = styled.div<{}>`
  overflow-y: auto;
  height: 100%;
`;
