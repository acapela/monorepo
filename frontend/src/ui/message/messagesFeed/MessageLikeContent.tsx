import { motion } from "framer-motion";
import { ReactNode, useRef } from "react";
import styled from "styled-components";
import { niceFormatDate } from "~shared/dates/format";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { UserBasicInfoFragment } from "~gql";
import { TimeLabelWithDateTooltip } from "~ui/time/DateLabel";

interface Props {
  user: UserBasicInfoFragment;
  date: Date;
  children: ReactNode;
  tools?: ReactNode;
  className?: string;
}

export const MessageLikeContent = styled(({ user, date, children, tools, className }: Props) => {
  const holderRef = useRef<HTMLDivElement>(null);
  const currentUser = useCurrentUser();

  const isOwnMessage = currentUser?.id === user.id;

  return (
    <UIAnimatedMessageWrapper ref={holderRef} isOwnMessage={isOwnMessage} className={className}>
      <MessageAvatar user={user} size="small" />
      <UIBody data-tooltip={niceFormatDate(date)}>
        <UIHead>
          {getUserOrGuestName(user)} <TimeLabelWithDateTooltip date={date} />
        </UIHead>
        {children}
      </UIBody>
      {tools && <UITools>{tools}</UITools>}
    </UIAnimatedMessageWrapper>
  );
})``;

const UIAnimatedMessageWrapper = styled.div<{ isOwnMessage: boolean }>`
  width: auto;
  display: inline-flex;
  align-items: flex-start;
  gap: 16px;

  ${() => UITools} {
    opacity: 0;
    transition: 0.1s all;
  }

  &:hover {
    ${() => UITools} {
      opacity: 1;
    }
  }

  ${() => UIBody} {
    margin-top: 8px;
  }
`;

const MessageAvatar = styled(UserAvatar)`
  width: 40px;
  height: 40px;
  margin-top: 5px;
  flex-shrink: 0;
`;

const UITools = styled(motion.div)`
  margin-top: 0.25rem;
`;

const UIHead = styled.div`
  font-weight: bold;
  margin-bottom: 8px;

  ${TimeLabelWithDateTooltip} {
    opacity: 0.4;
    user-select: none;
  }
`;

function getUserOrGuestName(user: UserBasicInfoFragment): string {
  return user?.name || "Guest";
}

const UIBody = styled.div`
  min-width: 360px;
  max-width: 700px;
`;
