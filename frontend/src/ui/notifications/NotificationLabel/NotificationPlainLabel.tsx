import { AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { ReactNode } from "react";
import styled from "styled-components";
import { NotificationInfoFragment } from "~gql";
import { relativeFormatDateTime } from "~shared/dates/format";
import { handleWithStopPropagation } from "~shared/events";
import { useIsElementOrChildHovered } from "~shared/hooks/useIsElementOrChildHovered";
import { PopPresenceAnimator } from "~ui/animations";
import { borderRadius } from "~ui/baseStyles";
import { CircleIconButton } from "~ui/buttons/CircleIconButton";
import { BACKGROUND_ACCENT, BACKGROUND_ACCENT_WEAK, NOTIFICATION_COLOR } from "~ui/theme/colors/base";
import { IconCheck, IconNotificationIndicator } from "~ui/icons";
import { hoverTransition } from "~ui/transitions";
import { TextBody14, TextBody } from "~ui/typo";
import { markNotificationAsRead, markNotificationAsUnread } from "~frontend/gql/notifications";
import { useCurrentTeamMember } from "~frontend/gql/teams";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";

interface Props {
  userId: string;
  date: Date;
  titleNode: ReactNode;
  id: string;
  onClick?: () => void;
  notification: NotificationInfoFragment;
}

export function NotificationPlainLabel({ userId, date, titleNode, id, onClick, notification }: Props) {
  const holderRef = useRef<HTMLDivElement>(null);
  const user = useCurrentTeamMember(userId);
  const isRead = !!notification.read_at;

  const isHovered = useIsElementOrChildHovered(holderRef);

  function handleClick() {
    markAsRead();
    onClick?.();
  }

  function markAsRead() {
    markNotificationAsRead({ id, date: new Date().toISOString() });
  }

  function markAsUnread() {
    markNotificationAsUnread({ id });
  }

  return (
    <UIHolder onClick={handleClick} ref={holderRef}>
      <UserAvatar user={user ?? undefined} />
      <UIContent>
        <UITitle>{titleNode}</UITitle>
        <UIDate secondary semibold>
          {relativeFormatDateTime(date)}
        </UIDate>
      </UIContent>
      <UIStatus>
        <AnimatePresence exitBeforeEnter>
          {!isHovered && (
            <PopPresenceAnimator key="not-hovered">{!isRead && <UIUnreadIndicator />}</PopPresenceAnimator>
          )}
          {isHovered && (
            <PopPresenceAnimator key="hovered">
              {isRead && (
                <CircleIconButton
                  icon={<IconNotificationIndicator />}
                  tooltip="Mark as unread"
                  onClick={handleWithStopPropagation(markAsUnread)}
                />
              )}
              {!isRead && (
                <CircleIconButton
                  icon={<IconCheck />}
                  tooltip="Mark as read"
                  onClick={handleWithStopPropagation(markAsRead)}
                />
              )}
            </PopPresenceAnimator>
          )}
        </AnimatePresence>
      </UIStatus>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: ${BACKGROUND_ACCENT_WEAK};
  cursor: pointer;

  ${borderRadius.item}

  &:hover {
    background-color: ${BACKGROUND_ACCENT};
  }

  ${hoverTransition()}
`;

const UIContent = styled.div`
  flex-grow: 1;
  min-width: 0;
  strong {
    font-weight: 500;
  }
`;

const UITitle = styled(TextBody14)``;

const UIDate = styled(TextBody)`
  font-size: 10px;
`;

const UIStatus = styled.div`
  min-width: 32px;
  display: flex;
  justify-content: center;
`;

const UIUnreadIndicator = styled.div`
  background-color: ${NOTIFICATION_COLOR};
  height: 8px;
  width: 8px;
  ${borderRadius.circle};
`;
