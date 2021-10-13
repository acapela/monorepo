import { motion } from "framer-motion";
import { ReactNode, useRef } from "react";
import styled, { css } from "styled-components";

import { UserEntity } from "~frontend/clientdb/user";
import { styledObserver } from "~shared/component";
import { useBoolean } from "~shared/hooks/useBoolean";
import { theme } from "~ui/theme";

import { MessageMetaDataWrapper } from "./MessageMetaData";

interface Props {
  user: UserEntity;
  date: Date;
  children: ReactNode;
  showOnlyContent?: boolean;
  tools?: ReactNode;
  className?: string;
}

export const MessageLikeContent = styledObserver<Props>(
  ({ user, date, children, tools, className, showOnlyContent = false }) => {
    const holderRef = useRef<HTMLDivElement>(null);
    const [isHovered, { set: setHovered, unset: unsetHovered }] = useBoolean(false);

    return (
      <UIAnimatedMessageWrapper
        ref={holderRef}
        className={className}
        onMouseEnter={() => setHovered()}
        onMouseLeave={() => unsetHovered()}
        hasTopSpacing={!showOnlyContent}
      >
        <UIContentContainer>
          <MessageMetaDataWrapper user={user} date={date} isNextSameUserMessage={showOnlyContent} isHovered={isHovered}>
            {children}
          </MessageMetaDataWrapper>
          {tools && <UIFlyingTools>{tools}</UIFlyingTools>}
        </UIContentContainer>
      </UIAnimatedMessageWrapper>
    );
  }
)``;

const UIFlyingTools = styled(motion.div)<{}>`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const UIContentContainer = styled.div<{}>`
  position: relative;

  width: 100%;

  ${MessageMetaDataWrapper} {
    /* About half text size in padding */
    padding: 0.5rem 8px;
  }
`;

const UIAnimatedMessageWrapper = styled.div<{ hasTopSpacing: boolean }>`
  display: flex;
  align-items: start;

  ${theme.radius.secondaryItem};
  ${theme.transitions.hover()};

  ${UIFlyingTools} {
    opacity: 0;
    transition: 0.1s all;
  }

  ${(props) =>
    props.hasTopSpacing &&
    css`
      margin-top: 30px;
    `}

  &:hover {
    background: ${theme.colors.layout.backgroundAccent};

    ${UIFlyingTools} {
      opacity: 1;
    }
  }
`;
