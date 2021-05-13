import Link from "next/link";
import React, { FC, ReactNode } from "react";
import styled from "styled-components";
import { Logo } from "./Logo";

const UISidebar = styled.div`
  padding: 60px;
  min-height: 100vh;
  background-color: #fbfbfb;
  min-width: 360px;
`;

const UISidebarLogoWrapper = styled.a`
  display: block;
  width: 120px;
  margin-bottom: 4rem;
`;

const UIHolder = styled.div`
  display: flex;
  min-height: 100vh;
`;

const UIMainContent = styled.div`
  padding: 120px 60px 60px 90px;
  flex-grow: 1;
  max-height: 100vh;
`;

interface Props {
  children?: ReactNode;
  sidebarContent?: ReactNode;
  sidebarAction?: ReactNode;
}

export const SidebarLayout: FC<Props> = ({ children, sidebarContent, sidebarAction }) => {
  return (
    <UIHolder>
      <UISidebar>
        <Link href="/home" passHref>
          <UISidebarLogoWrapper>
            <Logo />
          </UISidebarLogoWrapper>
        </Link>

        {sidebarContent}
        {sidebarAction}
      </UISidebar>
      <UIMainContent>{children}</UIMainContent>
    </UIHolder>
  );
};
