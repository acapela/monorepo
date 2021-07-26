import { AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { useClickAway } from "react-use";
import styled from "styled-components";
import { useBoolean } from "~frontend/../../shared/hooks/useBoolean";
import { borderRadius } from "~frontend/../../ui/baseStyles";
import { CircleIconButton } from "~frontend/../../ui/buttons/CircleIconButton";
import { NOTIFICATION_COLOR } from "~frontend/../../ui/colors";
import { IconActivity } from "~frontend/../../ui/icons";
import { Popover } from "~frontend/../../ui/popovers/Popover";
import { useUnreadNotifications } from "~frontend/gql/notifications";
import { NotificationsCenterPopover } from "./NotificationsCenterPopover";

export function NotificationsOpener() {
  const [unreadNotifications = []] = useUnreadNotifications();
  const [isOpened, { set: openNotifications, unset: closeNotifications }] = useBoolean(false);

  const hasUnreadNotifications = unreadNotifications.length > 0;

  const buttonRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <UIHolder ref={buttonRef}>
        {hasUnreadNotifications && <UIUnreadNotificationsIndicator />}
        <CircleIconButton size="medium" icon={<IconActivity />} iconSizeRatio={3 / 5} onClick={openNotifications} />
      </UIHolder>
      <AnimatePresence>
        {isOpened && (
          <Popover anchorRef={buttonRef} placement="bottom-end">
            <NotificationsCenterPopover onCloseRequest={closeNotifications} />
          </Popover>
        )}
      </AnimatePresence>
    </>
  );
}

const UIHolder = styled.div`
  position: relative;
`;

const UIUnreadNotificationsIndicator = styled.div`
  height: 8px;
  width: 8px;
  ${borderRadius.circle}
  background-color: ${NOTIFICATION_COLOR};
  position: absolute;
  top: 4px;
  right: 4px;
`;
