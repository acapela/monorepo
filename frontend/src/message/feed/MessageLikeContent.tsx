import { AnimatePresence } from "framer-motion";
import { ReactNode, useRef } from "react";
import styled from "styled-components";

import { UserEntity } from "@aca/frontend/clientdb/user";
import { styledObserver } from "@aca/shared/component";
import { useBoolean } from "@aca/shared/hooks/useBoolean";
import { PresenceAnimator } from "@aca/ui/PresenceAnimator";
import { theme } from "@aca/ui/theme";

import { MessageMetaDataWrapper } from "./MessageMetaData";

interface Props {
  user: UserEntity;
  anchorLink?: string;
  date: Date;
  children: ReactNode;
  showOnlyContent?: boolean;
  tools?: ReactNode;
  className?: string;
}

export const MessageLikeContent = styledObserver<Props>(
  ({ user, date, children, tools, className, anchorLink, showOnlyContent = false }) => {
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
          <MessageMetaDataWrapper
            anchorLink={anchorLink}
            user={user}
            date={date}
            isNextSameUserMessage={showOnlyContent}
            isHovered={isHovered}
          >
            {children}
          </MessageMetaDataWrapper>
          {tools && (
            <AnimatePresence>
              {isHovered && (
                <UIFlyingTools layoutId="message-tools-flying" layout="position" presenceStyles={{ opacity: [0, 1] }}>
                  {tools}
                </UIFlyingTools>
              )}
            </AnimatePresence>
          )}
        </UIContentContainer>
      </UIAnimatedMessageWrapper>
    );
  }
)``;

const UIFlyingTools = styled(PresenceAnimator)<{}>`
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: -3px;
  will-change: transform, opacity;
  ${theme.colors.layout.backgroundAccent.withBorder.asBgWithReadableText};
  ${theme.shadow.popover};
  ${theme.box.buttonsGroup};
  ${theme.radius.panel};
`;

const UIContentContainer = styled.div<{}>`
  position: relative;

  width: 100%;
`;

const UIAnimatedMessageWrapper = styled.div<{ hasTopSpacing: boolean }>`
  display: flex;
  align-items: start;
  padding: 10px;

  ${theme.radius.secondaryItem};
  ${theme.transitions.hover()};

  &:hover {
    ${theme.colors.layout.background.hover.opacity(0.5).asBg};
  }
`;
