import { gql, useMutation } from "@apollo/client";
import { AnimatePresence } from "framer-motion";
import { MouseEvent, ReactNode } from "react";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { withFragments } from "~frontend/gql/utils";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import {
  NotificationPlainLabel_NotificationFragment,
  NotificationPlainLabel_UserFragment,
  UpdateNotificationReadAtMutation,
  UpdateNotificationReadAtMutationVariables,
} from "~gql";
import { relativeFormatDateTime } from "~shared/dates/format";
import { handleWithStopPropagation } from "~shared/events";
import { useIsElementOrChildHovered } from "~shared/hooks/useIsElementOrChildHovered";
import { useSharedRef } from "~shared/hooks/useSharedRef";
import { namedForwardRef } from "~shared/react/namedForwardRef";
import { PopPresenceAnimator } from "~ui/animations";
import { borderRadius } from "~ui/baseStyles";
import { CircleIconButton } from "~ui/buttons/CircleIconButton";
import { IconCheck, IconNotificationIndicator } from "~ui/icons";
import { BACKGROUND_ACCENT, BACKGROUND_ACCENT_WEAK, NOTIFICATION_COLOR } from "~ui/theme/colors/base";
import { hoverTransition } from "~ui/transitions";
import { TextBody, TextBody14 } from "~ui/typo";

const fragments = {
  notification: gql`
    fragment NotificationPlainLabel_notification on notification {
      id
      created_at
      read_at
    }
  `,
  user: gql`
    ${UserAvatar.fragments.user}

    fragment NotificationPlainLabel_user on user {
      ...UserAvatar_user
    }
  `,
};

interface Props {
  notification: NotificationPlainLabel_NotificationFragment;
  user: NotificationPlainLabel_UserFragment;
  date?: Date;
  onClick?: (event: MouseEvent) => void;
  children: ReactNode;
}

const _NotificationPlainLabel = namedForwardRef<HTMLDivElement, Props>(function NotificationPlainLabel(
  { user, children, onClick, notification, date = new Date(notification.created_at) },
  ref
) {
  const holderRef = useSharedRef<HTMLDivElement | null>(null, [ref]);
  const id = notification.id;
  const isRead = !!notification.read_at;

  const isHovered = useIsElementOrChildHovered(holderRef);

  const [updateNotificationReadAt] = useMutation<
    UpdateNotificationReadAtMutation,
    UpdateNotificationReadAtMutationVariables
  >(
    gql`
      mutation UpdateNotificationReadAt($id: uuid!, $readAt: timestamptz) {
        notification: update_notification_by_pk(pk_columns: { id: $id }, _set: { read_at: $readAt }) {
          id
          read_at
        }
      }
    `,
    {
      optimisticResponse: ({ id, readAt }) => ({
        __typename: "mutation_root",
        notification: { __typename: "notification", id, read_at: readAt },
      }),
    }
  );

  function handleClick(event: MouseEvent) {
    markAsRead();
    onClick?.(event);
    trackEvent("Clicked Notification Link");
  }

  function markAsRead() {
    updateNotificationReadAt({ variables: { id, readAt: new Date().toISOString() } });
    trackEvent("Marked Notification As Read");
  }

  function markAsUnread() {
    updateNotificationReadAt({ variables: { id, readAt: null } });
    trackEvent("Marked Notification As Unread");
  }

  return (
    <UIHolder onClick={handleClick} ref={holderRef}>
      <UserAvatar user={user} />
      <UIContent>
        <UITitle>{children}</UITitle>
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
});

export const NotificationPlainLabel = withFragments(fragments, _NotificationPlainLabel);

const UIHolder = styled.div<{}>`
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

const UIContent = styled.div<{}>`
  flex-grow: 1;
  min-width: 0;
  strong {
    font-weight: 500;
  }
`;

const UITitle = styled(TextBody14)<{}>``;

const UIDate = styled(TextBody)<{}>`
  font-size: 10px;
`;

const UIStatus = styled.div<{}>`
  min-width: 32px;
  display: flex;
  justify-content: center;
`;

const UIUnreadIndicator = styled.div<{}>`
  background-color: ${NOTIFICATION_COLOR};
  height: 8px;
  width: 8px;
  ${borderRadius.circle};
`;
