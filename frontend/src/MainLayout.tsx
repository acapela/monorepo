import { PropsWithChildren } from "react";
import styled from "styled-components";

import { SidebarLayout } from "./ui/Layout";
import { NavLink } from "./ui/NavLink";

export const MainLayout = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <SidebarLayout
      sidebarContent={
        <>
          <UINavItems>
            <SpacedNavLink to="/">Upcoming Acapelas</SpacedNavLink>
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

const UINavItems = styled.nav<{}>`
  margin-bottom: 2rem;
`;

const SpacedNavLink = styled(NavLink)<{}>`
  margin-bottom: 1rem;
`;
