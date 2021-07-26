import { ReactNode } from "react";
import styled from "styled-components";
import { NotificationInfoFragment } from "~frontend/../../gql";
import { relativeFormatDate } from "~frontend/../../shared/dates/format";
import { borderRadius } from "~frontend/../../ui/baseStyles";
import { BACKGROUND_ACCENT, BACKGROUND_ACCENT_WEAK, NOTIFICATION_COLOR } from "~frontend/../../ui/colors";
import { hoverTransition } from "~frontend/../../ui/transitions";
import { TextBody14, TextBody } from "~frontend/../../ui/typo";
import { markNotificationAsRead } from "~frontend/gql/notifications";
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
  const user = useCurrentTeamMember(userId);
  const isUnread = !notification.read_at;

  function handleClick() {
    markNotificationAsRead({ id });
    onClick?.();
  }

  return (
    <UIHolder onClick={handleClick}>
      <UserAvatar user={user} />
      <UIContent>
        <UITitle>{titleNode}</UITitle>
        <UIDate secondary semibold>
          {relativeFormatDate(date)}
        </UIDate>
      </UIContent>
      {isUnread && <UIUnreadIndicator />}
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

const UIUnreadIndicator = styled.div`
  background-color: ${NOTIFICATION_COLOR};
  height: 8px;
  width: 8px;
  ${borderRadius.circle};
`;
