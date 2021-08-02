import React from "react";
import styled from "styled-components";
import { PrimaryNavigationItem } from "./PrimaryNavigationItem";
import { IconHome, IconSpaces, IconCalendarDates } from "~ui/icons";

export const PrimaryNavigation = () => (
  <UINav>
    <PrimaryNavigationItem icon={<IconHome />} title={"Home"} href="/" />
    <PrimaryNavigationItem icon={<IconSpaces />} title={"Spaces"} href="/spaces" />
    <PrimaryNavigationItem icon={<IconCalendarDates />} title={"Calendar"} href="/calendar" />
  </UINav>
);

const UINav = styled.nav<{}>`
  display: flex;
  gap: 8px;
`;
