import React from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { motion, MotionProps } from "framer-motion";
import { Avatar } from "@acapela/frontend/design/Avatar";
import { ThreadMessageBasicInfoFragment } from "@acapela/frontend/gql";

interface MessageWithUserInfo extends ThreadMessageBasicInfoFragment {
  isOwnMessage: boolean;
}

interface UITextMessageProps extends MotionProps {
  message: MessageWithUserInfo;
}

const UITimestampWrapper = styled.div``;

const UITextMessageWrapper = styled(motion.div).attrs({
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
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  border-radius: 0.5rem;

  --tw-space-x-reverse: 0;
  margin-right: calc(0.5rem * var(--tw-space-x-reverse));
  margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));

  --tw-space-y-reverse: 0;
  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));

  --tw-bg-opacity: 1;

  ${Avatar} {
    width: 3.5rem;
    height: 3.5rem;
    flex-shrink: 0;

    --tw-border-opacity: 1;
    border-color: rgba(243, 244, 246, var(--tw-border-opacity));

    ${({ message }) => (message.isOwnMessage ? "margin-left: 0.5rem;" : "margin-right: 0.5rem;")}
  }

  ${UITimestampWrapper} {
    margin-top: 0.25rem;

    ${({ message }) => message.isOwnMessage && "text-align: right;"}
  }

  ${({ message }) =>
    message.isOwnMessage
      ? `
      align-self: flex-end;
      flex-direction: row-reverse;
      --tw-space-x-reverse: 1;
      background-color: rgba(239, 246, 255, var(--tw-bg-opacity));
      `
      : `
      align-self: flex-start;
      background-color: rgba(243, 244, 246, var(--tw-bg-opacity));
    `}
`;

const UIUserName = styled.span`
  font-weight: 700;
`;

const UITimestamp = styled.span`
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.25rem;

  --tw-text-opacity: 1;
  color: rgba(156, 163, 175, var(--tw-text-opacity));
`;

function getUserOrGuestName(message: MessageWithUserInfo): string {
  return message.user.name || "Guest";
}

export const TextMessage: React.FC<{ message: MessageWithUserInfo }> = ({ message }) => {
  return (
    <UITextMessageWrapper message={message}>
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
    </UITextMessageWrapper>
  );
};
