import { motion } from "framer-motion";
import { observer } from "mobx-react";
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
  user: UserEntity;
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
      <UIContentContainer>
        <MessageMetaDataWrapper user={user} date={date} isHidden={hasHiddenMetadata} isHovered={isHovered}>
          {children}
        </MessageMetaDataWrapper>
        {tools && <UIFlyingTools>{tools}</UIFlyingTools>}
      </UIContentContainer>
    </UIAnimatedMessageWrapper>
  );
})``;

    return (
      <UIAnimatedMessageWrapper ref={holderRef} isOwnMessage={isOwnMessage} className={className}>
        <MessageMetaData user={user} date={date}>
          {children}
        </MessageMetaData>
        {tools && <UITools>{tools}</UITools>}
      </UIAnimatedMessageWrapper>
    );
  })
)``;

const UIFlyingTools = styled(motion.div)<{}>`
  position: absolute;
  /* Doesn't block text */
  top: -16px;
  right: 0;
`;

const UIContentContainer = styled.div<{}>`
  position: relative;

  /* Needed to have tools fly close to text */
  min-width: 332px;
  max-width: 732px;

  ${MessageMetaDataWrapper} {
    /* About half text size in padding */
    padding: 0.5rem 8px;
  }
`;

const UIAnimatedMessageWrapper = styled.div<{}>`
  display: flex;
  align-items: start;

  ${theme.borderRadius.item}
  ${theme.transitions.hover()}

  ${UIFlyingTools} {
    opacity: 0;
    transition: 0.1s all;
  }

  &:hover {
    background: ${theme.colors.interactive.selected()};

    ${UIFlyingTools} {
      opacity: 1;
    }
  }
`;
