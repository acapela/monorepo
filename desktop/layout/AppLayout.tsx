import React, { ReactNode } from "react";
import styled from "styled-components";

interface Props {
  children: ReactNode;
  tray: ReactNode;
  footer: ReactNode;
}

export function AppLayout({ children, tray, footer }: Props) {
  return (
    <AppLayoutHolder>
      <UIMain>
        <UITray>{tray}</UITray>
        <UIBody>{children}</UIBody>
      </UIMain>
      <UIFooter>{footer}</UIFooter>
    </AppLayoutHolder>
  );
}

const UITray = styled.div`
  width: 72px;
  min-width: 72px;
  display: flex;
  flex-direction: column;
`;

const UIMain = styled.div`
  display: flex;
`;

const UIBody = styled.div``;

const UIFooter = styled.div``;

const AppLayoutHolder = styled.div`
  padding-top: 48px;
  display: flex;
  flex-direction: column;
`;
