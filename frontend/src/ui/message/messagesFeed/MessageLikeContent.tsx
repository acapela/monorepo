import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useRef } from "react";
import styled, { css } from "styled-components";

import { PresenceAnimator } from "~frontend/../../ui/PresenceAnimator";
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
          {tools && (
            <AnimatePresence>
              {isHovered && <UIFlyingTools presenceStyles={{ opacity: [0, 1] }}>{tools}</UIFlyingTools>}
            </AnimatePresence>
          )}
        </UIContentContainer>
      </UIAnimatedMessageWrapper>
    );
  }
)``;

const UIFlyingTools = styled(PresenceAnimator)<{}>`
  position: absolute;
  top: 0px;
  right: 0px;
`;

const UIContentContainer = styled.div<{}>`
  position: relative;

  width: 100%;
`;

const UIAnimatedMessageWrapper = styled.div<{ hasTopSpacing: boolean }>`
  display: flex;
  align-items: start;
  padding: 7px;
  margin: 0 -7px;

  ${theme.radius.secondaryItem};
  ${theme.transitions.hover()};

  ${(props) =>
    props.hasTopSpacing &&
    css`
      margin-top: 30px;
    `}

  &:hover {
    ${theme.colors.layout.background.hover.opacity(0.5).asBg};
  }
`;
