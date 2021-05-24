import Link from "next/link";
import React, { ReactNode } from "react";
import styled from "styled-components";
import { CalendarOutline, HomeOutline, KeypadOutline } from "~ui/icons";
import { Logo } from "~frontend/ui/Logo";
import { NavItem } from "./NavItem";
import { AppLayoutStyles } from "./styles";
import { UserMenu } from "./UserMenu";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TeamPickerView } from "./TeamPicker";
import { WindowView } from "~frontend/views/WindowView";
import { LoginOptionsView } from "~frontend/views/LoginOptionsView";

interface Props {
  children?: ReactNode;
}

export const AppLayout = ({ children }: Props) => {
  const user = useCurrentUser();

  if (!user) {
    return (
      <WindowView>
        <LoginOptionsView />
      </WindowView>
    );
  }

  if (!user.currentTeamId) {
    return (
      <WindowView>
        <TeamPickerView />
      </WindowView>
    );
  }

  return (
    <>
      <AppLayoutStyles />
      <UIHolder>
        <UITopBar>
          <Link href="/" passHref>
            <UILogo>
              <Logo />
            </UILogo>
          </Link>
          <UINav>
            <NavItem icon={<HomeOutline />} label="Home" href="/" />
            <NavItem icon={<KeypadOutline />} label="Spaces" href="/spaces" />
            <NavItem icon={<CalendarOutline />} label="Calendar" href="/calendar" />
          </UINav>
          <UIUserMenu>
            <UserMenu />
          </UIUserMenu>
        </UITopBar>
        <UIMainContent>{children}</UIMainContent>
      </UIHolder>
    </>
  );
};

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const UITopBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;

  background: #ffffff;
  box-shadow: 0px 1px 0px #ededed;
`;

const UILogo = styled.a`
  display: block;
  width: 120px;
`;

const UIMainContent = styled.div`
  padding: 2rem;
  min-height: 0;
  overflow-y: auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const UINav = styled.nav`
  display: flex;

  ${NavItem} {
    margin: 0 1em;
  }
`;

const UIUserMenu = styled.div``;
