import { useRef } from "react";
import styled from "styled-components";
import { UIDropdownPanelBody } from "~ui/popovers/DropdownPanelBody";
import { TextH3 } from "~ui/typo";
import { useNotifications } from "~frontend/gql/notifications";
import { NotificationsTimeline } from "~frontend/ui/notifications/NotificationLabel/NotificationsTimeline";
import { theme } from "~frontend/../../ui/theme";

export function NotificationsCenterPopover() {
  const holderRef = useRef<HTMLDivElement>(null);
  const [notifications = []] = useNotifications();

  return (
    <UIHolder ref={holderRef}>
      <TextH3 spezia semibold>
        Recent Activity
      </TextH3>
      <UINotifications>
        <NotificationsTimeline notifications={notifications} />
      </UINotifications>
    </UIHolder>
  );
}

const UIHolder = styled(UIDropdownPanelBody)`
  min-width: 540px;
  padding: 32px 0 0;

  ${TextH3} {
    padding: 0 32px;
  }
`;

const UINotifications = styled.div`
  margin-top: 16px;
  max-height: 40vh;
  overflow-y: auto;
  padding: 32px;
`;
