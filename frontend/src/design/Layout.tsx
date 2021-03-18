import styled from "styled-components";
import { Logo } from "./Logo";

export const Sidebar: React.FC<{
  children?: React.ReactNode;
  action?: React.ReactNode;
}> = ({ children, action }) => {
  return (
    <UISidebar>
      <SidebarLogo />

      {children}
      <span className="mt-auto">{action}</span>
    </UISidebar>
  );
};

const UISidebar = styled.div`
  padding: 60px;
  min-height: 100vh;
  background-color: #fbfbfb;
  min-width: 360px;
`;

const SidebarLogo = styled(Logo)`
  width: 120px;
  margin-bottom: 4rem;
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
      <Sidebar action={sidebar.action}>{sidebar.content}</Sidebar>
      <UIMainContent>{children}</UIMainContent>
    </UIHolder>
  );
};

const UIHolder = styled.div`
  display: flex;
  min-height: 100vh;
`;

const UIMainContent = styled.div`
  padding: 120px 60px 60px 90px;
  flex-grow: 1;
`;
