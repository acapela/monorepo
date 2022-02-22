// TODO: add ".jpg" types for CI to not complain
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { observer } from "mobx-react";
import React, { ReactNode } from "react";
import styled, { css } from "styled-components";

//@ts-ignore
import zenImage from "@aca/desktop/assets/zen/today.jpg";
import { uiStore } from "@aca/desktop/store/ui";
import { theme } from "@aca/ui/theme";

interface Props {
  children: ReactNode;
  tray: ReactNode;
  footer: ReactNode;
}

export const AppLayout = observer(function AppLayout({ children, tray, footer }: Props) {
  const { isSidebarOpened } = uiStore;

  return (
    <AppLayoutHolder className={uiStore.isDisplayingZenImage ? "zenImage" : ""}>
      <UIMain>
        <UITray>{tray}</UITray>
        <UIBody $isSidebarOpened={isSidebarOpened}>{children}</UIBody>
      </UIMain>
      <UIFooter>{footer}</UIFooter>
    </AppLayoutHolder>
  );
});

const UITray = styled.div`
  width: 72px;
  min-width: 72px;
  display: flex;
  flex-direction: column;
`;

const UIMain = styled.div`
  display: flex;
  flex-grow: 1;
  min-height: 0;
`;

const UIBody = styled.div<{ $isSidebarOpened: boolean }>`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;

  ${(props) =>
    props.$isSidebarOpened &&
    css`
      opacity: 0.5;
    `}
`;

const UIFooter = styled.div`
  z-index: 2;
`;

const AppLayoutHolder = styled.div<{}>`
  padding-top: 48px;

  body.fullscreen & {
    padding-top: 24px;
  }
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  &.zenImage {
    animation: fadeInFromNone 2s linear;

    background-repeat: no-repeat;
    background-size: cover;
    background-image: url(${zenImage as unknown as string});
    box-shadow: inset 0 0 80px 80px ${theme.colors.layout.background.opacity(0.8).value};
  }

  @keyframes fadeInFromNone {
    0% {
      display: none;
      opacity: 0;
    }

    1% {
      display: block;
      opacity: 0;
    }

    100% {
      display: block;
      opacity: 1;
    }
  }
`;
