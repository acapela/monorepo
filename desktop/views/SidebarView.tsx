// import { theme } from "@aca/ui/theme";
import React from "react";
import styled, { css } from "styled-components";

import { IconButton } from "@aca/ui/buttons/IconButton";
import { IconCross } from "@aca/ui/icons";
import { phone } from "@aca/ui/responsive";
import { theme } from "@aca/ui/theme";

export const SidebarView = function SidebarView() {
  return (
    <UIHolder>
      <UIHeader>
        <IconButton icon={<IconCross />} />
        <UIHeaderUser>{/* <UserMenu /> */}UserMenu</UIHeaderUser>
      </UIHeader>

      <UIRequestFeed>Requests are here</UIRequestFeed>
    </UIHolder>
  );
};

const UIHolder = styled.div<{}>`
  width: 100%;
  height: 100%;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const primaryPaddingInSidebar = css`
  padding: 20px;
  ${phone(
    css`
      padding: 15px;
    `
  )}
`;

const UIHeader = styled.div<{}>`
  ${primaryPaddingInSidebar}
  display: flex;
  flex-direction: row;
  align-items: center;
  ${theme.spacing.actions.asGap}

  ${IconButton} {
    display: none;
    ${phone(
      css`
        display: block;
      `
    )}
  }
`;

const UIHeaderUser = styled.div`
  flex-grow: 1;
  display: flex;
`;

const UIRequestFeed = styled.div<{}>`
  overflow-y: auto;
  height: 100%;
`;
