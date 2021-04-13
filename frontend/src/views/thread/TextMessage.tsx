import { format } from "date-fns";
import { motion, MotionProps } from "framer-motion";
import React from "react";
import styled from "styled-components";
import { Avatar } from "~frontend/design/Avatar";
import { ThreadMessageBasicInfoFragment } from "~frontend/gql";

interface MessageWithUserInfo extends ThreadMessageBasicInfoFragment {
  isOwnMessage: boolean;
}

interface UITextMessageProps extends MotionProps {
  message: MessageWithUserInfo;
}

const UITimestampWrapper = styled.div``;

const UIAnimatedMessageWrapper = styled(motion.div).attrs({
  variants: {
    hidden: {
      opacity: 0,
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
    },
  },
})<UITextMessageProps>`
  width: auto;
  display: inline-flex;
  align-items: center;
  align-self: ${({ message }) => (message.isOwnMessage ? "flex-end" : "flex-start")};
  background-color: ${({ message }) => (message.isOwnMessage ? "rgba(239, 246, 255, 1)" : "rgba(243, 244, 246, 1)")};
  flex-direction: ${({ message }) => (message.isOwnMessage ? "row-reverse" : "row")};

  padding: 0.5rem 0.75rem;
  margin-top: 0.5rem;
  margin-right: ${({ message }) => (message.isOwnMessage ? "0" : "0.5")}rem;
  margin-left: ${({ message }) => (message.isOwnMessage ? "0.5" : "0")}rem;

  border-radius: 0.5rem;

  ${Avatar} {
    width: 3.5rem;
    height: 3.5rem;
    flex-shrink: 0;
    ${({ message }) => (message.isOwnMessage ? "margin-left: 0.5rem;" : "margin-right: 0.5rem;")}

    border-color: rgba(243, 244, 246, 1);
  }

  ${UITimestampWrapper} {
    margin-top: 0.25rem;
    text-align: ${({ message }) => (message.isOwnMessage ? "right" : "left")};
  }
`;

const UIUserName = styled.span`
  font-weight: 700;
`;

const UITimestamp = styled.span`
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgba(156, 163, 175, 1);
`;

function getUserOrGuestName(message: MessageWithUserInfo): string {
  return message.user.name || "Guest";
}

export const TextMessage: React.FC<{ message: MessageWithUserInfo }> = ({ message }) => (
  <UIAnimatedMessageWrapper message={message}>
    <Avatar url={message.user.avatarUrl ?? ""} name={getUserOrGuestName(message)} />
    <div>
      <UITimestampWrapper>
        <UIUserName>{message.isOwnMessage ? "You" : getUserOrGuestName(message)}</UIUserName>
        &nbsp;
        <UITimestamp>
          ·&nbsp;
          {format(new Date(message.createdAt), "p")}
        </UITimestamp>
      </UITimestampWrapper>
      {message.text}
    </div>
  </UIAnimatedMessageWrapper>
);
