import { useRef } from "react";
import { useClickAway } from "react-use";
import styled from "styled-components";
import { UIDropdownPanelBody } from "~ui/popovers/DropdownPanelBody";
import { TextH3 } from "~ui/typo";
import { useNotifications } from "~frontend/gql/notifications";
import { NotificationsTimeline } from "~frontend/ui/notifications/NotificationLabel/NotificationsTimeline";

interface Props {
  onCloseRequest: () => void;
}

export function NotificationsCenterPopover({ onCloseRequest }: Props) {
  const holderRef = useRef<HTMLDivElement>(null);
  const [notifications] = useNotifications();

  useClickAway(holderRef, () => onCloseRequest());

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
