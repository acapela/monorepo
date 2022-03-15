// TODO: add ".jpg" types for CI to not complain
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { observer } from "mobx-react";
import React, { ReactNode } from "react";
import styled from "styled-components";

import { uiStore } from "@aca/desktop/store/ui";
import { theme } from "@aca/ui/theme";

interface Props {
  children: ReactNode;
  sidebar?: ReactNode;
  footer?: ReactNode;
}

export const AppLayout = observer(function AppLayout({ children, sidebar, footer }: Props) {
  const { isSidebarOpened } = uiStore;

  return (
    <AppLayoutHolder>
      <UIMain>
        {sidebar && <UISidebar>{sidebar}</UISidebar>}
        <UIBody $isSidebarOpened={isSidebarOpened}>
          {children}
          <UIFooter>{footer}</UIFooter>
        </UIBody>
      </UIMain>
    </AppLayoutHolder>
  );
});

const UISidebar = styled.div`
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
  position: relative;

  ${theme.colors.layout.background.asBgWithReadableText}
`;

const UIFooter = styled.div``;

const AppLayoutHolder = styled.div<{}>`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
`;
