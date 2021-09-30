import React, { ReactNode } from "react";
import styled from "styled-components";

import { DropFileContext } from "~richEditor/DropFileContext";
import { theme } from "~ui/theme";

interface Props {
  children: ReactNode;
  headerNode?: ReactNode;
  className?: string;
}

export const TopicViewCard = styled(({ children, headerNode, className }: Props) => {
  return (
    <UIHolder className={className}>
      {/* Absolutely placed backdrop will take it's width relative to the width its container */}
      {/* This works as this nested container holds no padding/margin left or right */}
      <UIBackdropContainer>
        <UIBackDrop />
        <UIMainContainer>
          {/* We need to render the topic header wrapper or else flex bugs out on page reload */}
          {headerNode && <UITopicHeaderHolder>{headerNode}</UITopicHeaderHolder>}
          {children}
        </UIMainContainer>
      </UIBackdropContainer>
    </UIHolder>
  );
})``;

const UIHolder = styled(DropFileContext)<{}>`
  height: 100%;
  padding-right: 24px;
`;

const UIBackdropContainer = styled.div<{}>`
  position: relative;
  padding-top: 24px;

  display: flex;
  flex-direction: column;

  height: 100%;
`;

const UIBackDrop = styled.div<{}>`
  position: absolute;
  top: 16px;

  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;

  height: 60px;
  width: 94%;

  background-color: ${theme.colors.layout.foreground()};
  border: 1px solid ${theme.colors.layout.softLine()};

  ${theme.borderRadius.card};
`;

const UITopicHeaderHolder = styled.div<{}>`
  background: ${theme.colors.layout.foreground()};

  ${theme.borderRadius.card}
  border-bottom-left-radius: 0%;
  border-bottom-right-radius: 0%;
`;

const UIMainContainer = styled.div<{}>`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-direction: column;

  background: ${theme.colors.layout.foreground()};
  border: 1px solid ${theme.colors.layout.softLine()};
  box-sizing: border-box;

  ${theme.borderRadius.card}
  border-bottom-left-radius: 0%;
  border-bottom-right-radius: 0%;

  ${theme.shadow.largeFrame}
`;
