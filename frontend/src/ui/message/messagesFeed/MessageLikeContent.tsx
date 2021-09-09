import { gql } from "@apollo/client";
import { motion } from "framer-motion";
import { ReactNode, useRef } from "react";
import styled from "styled-components";

import { withFragments } from "~frontend/gql/utils";
import { MessageLikeContent_UserFragment } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { theme } from "~ui/theme";

import { MessageMetaDataWrapper } from "./MessageMetaData";

const fragments = {
  user: gql`
    ${MessageMetaDataWrapper.fragments.user}

    fragment MessageLikeContent_user on user {
      id
      ...MessageMetaData_user
    }
  `,
};

interface Props {
  user: MessageLikeContent_UserFragment;
  date: Date;
  children: ReactNode;
  hasHiddenMetadata?: boolean;
  tools?: ReactNode;
  className?: string;
}

const _MessageLikeContent = styled<Props>(({ user, date, children, tools, className, hasHiddenMetadata = false }) => {
  const holderRef = useRef<HTMLDivElement>(null);
  const [isHovered, { set: setHovered, unset: unsetHovered }] = useBoolean(false);

  return (
    <UIAnimatedMessageWrapper
      ref={holderRef}
      className={className}
      onMouseEnter={() => setHovered()}
      onMouseLeave={() => unsetHovered()}
    >
      <MessageMetaDataWrapper user={user} date={date} isHidden={hasHiddenMetadata} isHovered={isHovered}>
        {children}
      </MessageMetaDataWrapper>
      {tools && <UITools>{tools}</UITools>}
    </UIAnimatedMessageWrapper>
  );
})``;

export const MessageLikeContent = withFragments(fragments, _MessageLikeContent);

const UITools = styled(motion.div)<{}>``;

const UIAnimatedMessageWrapper = styled.div<{}>`
  display: flex;
  align-items: start;
  padding: 8px 8px;

  ${theme.borderRadius.item};
  ${theme.transitions.hover()}

  ${UITools} {
    opacity: 0;
    transition: 0.1s all;
  }

  &:hover {
    background: ${theme.colors.interactive.selected()};

    ${UITools} {
      opacity: 1;
    }
  }
`;
