import { motion } from "framer-motion";
import { ReactNode, useRef } from "react";
import { useHoverDirty } from "react-use";
import styled from "styled-components";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { TopicMessageDetailedInfoFragment, UserBasicInfoFragment } from "~gql";
import { TimeLabelWithDateTooltip } from "~ui/time/DateLabel";

interface Props {
  user: UserBasicInfoFragment;
  date: Date;
  children: ReactNode;
  tools?: ReactNode;
}

export const MessageLikeContent = ({ user, date, children, tools }: Props) => {
  const holderRef = useRef<HTMLDivElement>(null);
  const isHovered = useHoverDirty(holderRef);
  const currentUser = useCurrentUser();

  console.log({ date });

  const isOwnMessage = currentUser?.id === user.id;
  return (
    <UIAnimatedMessageWrapper ref={holderRef} isOwnMessage={isOwnMessage}>
      {tools && <UITools>{tools}</UITools>}
      <MessageAvatar user={user} />
      <UIBody>
        <UIHead>
          User <TimeLabelWithDateTooltip date={date} />
        </UIHead>
        {children}
      </UIBody>
    </UIAnimatedMessageWrapper>
  );
};

const UIAnimatedMessageWrapper = styled.div<{ isOwnMessage: boolean }>`
  width: auto;
  display: inline-flex;
  align-items: flex-start;
  align-self: ${({ isOwnMessage }) => (isOwnMessage ? "flex-end" : "flex-start")};
  flex-direction: ${({ isOwnMessage }) => (isOwnMessage ? "row-reverse" : "row")};

  margin-top: 0.5rem;
  margin-right: ${({ isOwnMessage }) => (isOwnMessage ? "0" : "0.5")}rem;
  margin-left: ${({ isOwnMessage }) => (isOwnMessage ? "0.5" : "0")}rem;

  border-radius: 0.5rem;

  & > *:not(:last-child) {
    ${({ isOwnMessage }) => (isOwnMessage ? "margin-left: 1rem;" : "margin-right: 1rem;")}
  }

  ${() => MessageAvatar} {
    border-color: rgba(243, 244, 246, 1);
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
`;

function getUserOrGuestName(message: TopicMessageDetailedInfoFragment): string {
  return message.user.name || "Guest";
}

const UIBody = styled.div`
  padding: 1rem;
  border-radius: 1rem;
  min-width: 360px;
  max-width: 700px;
  background-color: rgb(238, 238, 238);
`;
