import { useRef } from "react";
import styled from "styled-components";
import { UIDropdownPanelBody } from "~ui/popovers/DropdownPanelBody";
import { TextH3 } from "~ui/typo";
import { useNotifications } from "~frontend/gql/notifications";
import { NotificationsTimeline } from "~frontend/ui/notifications/NotificationLabel/NotificationsTimeline";

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
  padding: 32px;
`;

const UINotifications = styled.div`
  margin-top: 16px;
`;
