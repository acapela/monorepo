import React from "react";
import styled from "styled-components";
import Link from "next/link";
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

const UIActionWrapper = styled.span`
  margin-top: auto;
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

export const SidebarLayout: React.FC<{
  children?: React.ReactNode;
  sidebar: {
    content?: React.ReactNode;
    action?: React.ReactNode;
  };
}> = ({ children, sidebar }) => {
  return (
    <UIHolder>
      <UISidebar>
        <Link href="/home" passHref>
          <UISidebarLogoWrapper>
            <Logo />
          </UISidebarLogoWrapper>
        </Link>

        {sidebar.content}
        <UIActionWrapper>{sidebar.action}</UIActionWrapper>
      </UISidebar>
      <UIMainContent>{children}</UIMainContent>
    </UIHolder>
  );
};
