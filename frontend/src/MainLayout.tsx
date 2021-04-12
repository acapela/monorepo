import styled from "styled-components";
import { SidebarLayout } from "./design/Layout";
import { NavLink } from "./design/NavLink";

export const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <SidebarLayout
      sidebarContent={
        <>
          <UINavItems>
            <SpacedNavLink to="/home">Upcoming Acapelas</SpacedNavLink>
            <SpacedNavLink to="/active">Active Acapelas</SpacedNavLink>
            <SpacedNavLink to="/past">Past Acapelas</SpacedNavLink>
            <SpacedNavLink to="/settings">Settings</SpacedNavLink>
          </UINavItems>
        </>
      }
    >
      {children}
    </SidebarLayout>
  );
};

const UINavItems = styled.nav`
  margin-bottom: 2rem;
`;

const SpacedNavLink = styled(NavLink)`
  margin-bottom: 1rem;
`;
