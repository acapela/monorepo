import { gql, useSubscription } from "@apollo/client";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { UnreadNotificationsCountSubscription, UnreadNotificationsCountSubscriptionVariables } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { useDependencyChangeEffect } from "~shared/hooks/useChangeEffect";
import { borderRadius } from "~ui/baseStyles";
import { CircleIconButton } from "~ui/buttons/CircleIconButton";
import { IconActivity } from "~ui/icons";
import { Popover } from "~ui/popovers/Popover";
import { NOTIFICATION_COLOR } from "~ui/theme/colors/base";

import { NotificationsCenterPopover } from "./NotificationsCenterPopover";

export function NotificationsOpener() {
  const router = useRouter();
  const { data } = useSubscription<UnreadNotificationsCountSubscription, UnreadNotificationsCountSubscriptionVariables>(
    gql`
      subscription UnreadNotificationsCount {
        unreadNotificationsAggregate: notification_aggregate(where: { read_at: { _is_null: true } }) {
          aggregate {
            count
          }
        }
      }
    `
  );
  const [isOpen, { set: openNotifications, unset: closeNotifications }] = useBoolean(false);

  useDependencyChangeEffect(() => {
    trackEvent("Toggled Notifications Center", { isOpen });
  }, [isOpen]);

  useEffect(() => {
    router.events.on("routeChangeStart", closeNotifications);
    return () => {
      router.events.off("routeChangeStart", closeNotifications);
    };
  }, [closeNotifications, router.events]);

  const hasUnreadNotifications = (data?.unreadNotificationsAggregate.aggregate?.count ?? 0) > 0;

  const buttonRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <UIHolder ref={buttonRef}>
        {hasUnreadNotifications && <UIUnreadNotificationsIndicator />}
        <CircleIconButton size="medium" icon={<IconActivity />} iconSizeRatio={3 / 5} onClick={openNotifications} />
      </UIHolder>
      <AnimatePresence>
        {isOpen && (
          <Popover enableScreenCover anchorRef={buttonRef} placement="bottom-end" onClickOutside={closeNotifications}>
            <NotificationsCenterPopover />
          </Popover>
        )}
      </AnimatePresence>
    </>
  );
}

const UIHolder = styled.div<{}>`
  position: relative;
`;

const UIUnreadNotificationsIndicator = styled.div<{}>`
  height: 8px;
  width: 8px;
  ${borderRadius.circle}
  background-color: ${NOTIFICATION_COLOR};
  position: absolute;
  top: 4px;
  right: 4px;
`;
