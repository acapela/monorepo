import { motion } from "framer-motion";
import { ReactNode, useRef } from "react";
import { useHoverDirty } from "react-use";
import styled from "styled-components";
import { niceFormatDate } from "~frontend/../../shared/dates/format";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { TopicMessageDetailedInfoFragment, UserBasicInfoFragment } from "~gql";
import { TimeLabelWithDateTooltip } from "~ui/time/DateLabel";

interface Props {
  user: UserBasicInfoFragment;
  date: Date;
  children: ReactNode;
  tools?: ReactNode;
  className?: string;
  hideMessageHead?: boolean;
}

export const MessageLikeContent = styled(({ user, date, children, tools, hideMessageHead, className }: Props) => {
  const holderRef = useRef<HTMLDivElement>(null);
  const currentUser = useCurrentUser();

  const isOwnMessage = currentUser?.id === user.id;

  return (
    <UIAnimatedMessageWrapper ref={holderRef} isOwnMessage={isOwnMessage} className={className}>
      <MessageAvatar user={user} />
      <UIBody data-tooltip={niceFormatDate(date)}>
        {!hideMessageHead && (
          <UIHead>
            {getUserOrGuestName(user)} <TimeLabelWithDateTooltip date={date} />
          </UIHead>
        )}
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
  align-self: ${({ isOwnMessage }) => (isOwnMessage ? "flex-end" : "flex-start")};
  flex-direction: ${({ isOwnMessage }) => (isOwnMessage ? "row-reverse" : "row")};
  gap: 16px;
  border-radius: 0.5rem;

  ${() => MessageAvatar} {
    border-color: rgba(243, 244, 246, 1);
  }

  ${() => UITools} {
    opacity: 0;
    transition: 0.1s all;
  }

  &:hover {
    ${() => UITools} {
      opacity: 1;
    }
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
  margin-bottom: 4px;

  ${TimeLabelWithDateTooltip} {
    opacity: 0.4;
    user-select: none;
  }
`;

function getUserOrGuestName(user: UserBasicInfoFragment): string {
  return user?.name || "Guest";
}

const UIBody = styled.div`
  padding: 1rem;
  border-radius: 1rem;
  min-width: 360px;
  max-width: 700px;
  background-color: rgb(238, 238, 238);
`;
