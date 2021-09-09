import { gql } from "@apollo/client";
import { motion } from "framer-motion";
import { ReactNode, useRef } from "react";
import styled from "styled-components";

import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { UserEntity } from "~frontend/clientdb/user";
import { withFragments } from "~frontend/gql/utils";
import { MessageLikeContent_UserFragment } from "~gql";
import { borderRadius } from "~ui/baseStyles";
import { ITEM_BACKGROUND_WEAK_TRANSPARENT } from "~ui/theme/colors/base";
import { hoverTransition } from "~ui/transitions";

import { MessageMetaData } from "./MessageMetaData";

const fragments = {
  user: gql`
    ${MessageMetaData.fragments.user}

    fragment MessageLikeContent_user on user {
      id
      ...MessageMetaData_user
    }
  `,
};

interface Props {
  user: UserEntity;
  date: Date;
  children: ReactNode;
  tools?: ReactNode;
  className?: string;
}

const _MessageLikeContent = styled<Props>(({ user, date, children, tools, className }) => {
  const holderRef = useRef<HTMLDivElement>(null);
  const currentUser = useCurrentUser();

  const isOwnMessage = currentUser?.id === user.id;

  return (
    <UIAnimatedMessageWrapper ref={holderRef} isOwnMessage={isOwnMessage} className={className}>
      <MessageMetaData user={user} date={date}>
        {children}
      </MessageMetaData>
      {tools && <UITools>{tools}</UITools>}
    </UIAnimatedMessageWrapper>
  );
})``;

export const MessageLikeContent = withFragments(fragments, _MessageLikeContent);

const UIAnimatedMessageWrapper = styled.div<{ isOwnMessage: boolean }>`
  display: flex;
  align-items: start;
  gap: 20px;
  padding: 14px 8px;
  ${borderRadius.item};
  ${hoverTransition()}

  ${() => UITools} {
    opacity: 0;
    transition: 0.1s all;
  }

  &:hover {
    background: ${ITEM_BACKGROUND_WEAK_TRANSPARENT};

    ${() => UITools} {
      opacity: 1;
    }
  }
`;

const UITools = styled(motion.div)<{}>`
  margin-top: 0.25rem;
`;
