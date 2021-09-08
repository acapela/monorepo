import { useRef } from "react";
import styled from "styled-components";

import { deleteAllReadNotifications, markAllNotificationsAsRead, useNotifications } from "~frontend/gql/notifications";
import { NotificationsTimeline } from "~frontend/ui/notifications/NotificationLabel/NotificationsTimeline";
import { OptionsButtonWithMenu } from "~frontend/ui/options/OptionsButtonWithMenu";
import { UIDropdownPanelBody } from "~ui/popovers/DropdownPanelBody";
import { theme } from "~ui/theme";
import { TextH3 } from "~ui/typo";

export function NotificationsCenterPopover() {
  const holderRef = useRef<HTMLDivElement>(null);
  const [notifications = []] = useNotifications();

  return (
    <UIHolder ref={holderRef}>
      <UITopbar>
        <UITitle>Recent Activity</UITitle>
        <OptionsButtonWithMenu
          options={[
            {
              label: "Mark all as read",
              async onSelect() {
                await markAllNotificationsAsRead({ date: new Date().toISOString() });
              },
            },
            {
              label: "Remove all read notifications",
              isDestructive: true,
              async onSelect() {
                await deleteAllReadNotifications({});
              },
            },
          ]}
        />
      </UITopbar>
      <UINotifications>
        <NotificationsTimeline notifications={notifications} />
      </UINotifications>
    </UIHolder>
  );
}

const UIHolder = styled(UIDropdownPanelBody)<{}>`
  min-width: 540px;
  padding: 32px 0 0;

  ${TextH3} {
    padding: 0 32px;
  }
`;

const UITopbar = styled.div`
  display: flex;
  min-width: 0;
  padding: 0 32px;
`;

const UITitle = styled.div`
  ${theme.font.h3.spezia.semibold.build()};
  flex-grow: 1;
`;

const UINotifications = styled.div<{}>`
  margin-top: 16px;
  max-height: 40vh;
  overflow-y: auto;
  padding: 32px;
`;
