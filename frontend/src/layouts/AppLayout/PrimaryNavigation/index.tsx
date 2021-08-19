import React from "react";
import styled from "styled-components";

import { IconCalendarDates, IconCheckboxSquare, IconHome, IconSpaces } from "~ui/icons";

import { PrimaryNavigationItem } from "./PrimaryNavigationItem";

export const PrimaryNavigation = () => (
  <UINav>
    <PrimaryNavigationItem icon={<IconHome />} title={"Home"} href="/" />
    <PrimaryNavigationItem icon={<IconCheckboxSquare />} title={"To-do"} href="/to-do" />
    <PrimaryNavigationItem icon={<IconSpaces />} title={"Spaces"} href="/spaces" />
    <PrimaryNavigationItem icon={<IconCalendarDates />} title={"Calendar"} href="/calendar" />
  </UINav>
);

const UINav = styled.nav<{}>`
  display: flex;
  gap: 8px;
`;
