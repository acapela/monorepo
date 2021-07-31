import { AnimatePresence } from "framer-motion";
import { useRef } from "react";
import styled from "styled-components";
import { useBoolean } from "~shared/hooks/useBoolean";
import { borderRadius } from "~ui/baseStyles";
import { CircleIconButton } from "~ui/buttons/CircleIconButton";
import { NOTIFICATION_COLOR } from "~ui/theme/colors/base";
import { IconActivity } from "~ui/icons";
import { Popover } from "~ui/popovers/Popover";
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
          <Popover enableScreenCover anchorRef={buttonRef} placement="bottom-end" onClickOutside={closeNotifications}>
            <NotificationsCenterPopover />
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
