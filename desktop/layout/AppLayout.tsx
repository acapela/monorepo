import { observer } from "mobx-react";
import React, { ReactNode } from "react";
import styled, { css } from "styled-components";

import { uiStore } from "@aca/desktop/store/uiStore";

interface Props {
  children: ReactNode;
  tray: ReactNode;
  footer: ReactNode;
}

export const AppLayout = observer(function AppLayout({ children, tray, footer }: Props) {
  const { isSidebarOpened } = uiStore;

  return (
    <AppLayoutHolder>
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

const UIFooter = styled.div``;

const AppLayoutHolder = styled.div`
  padding-top: 48px;

  body.fullscreen & {
    padding-top: 24px;
  }
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
`;
