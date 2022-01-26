import React from "react";
import styled from "styled-components";

import { desktopRouter } from "@aca/desktop/routes";
import { IconButton } from "@aca/ui/buttons/IconButton";
import { IconCross } from "@aca/ui/icons";
import { PresenceAnimator } from "@aca/ui/PresenceAnimator";
import { theme } from "@aca/ui/theme";

import { SidebarItem } from "./SidebarItem";

interface Props {
  onCloseRequest: () => void;
}

export function Sidebar({ onCloseRequest }: Props) {
  return (
    <UIHolder presenceStyles={{ opacity: [0, 1] }}>
      <UITopTools>
        <IconButton onClick={onCloseRequest} icon={<IconCross />} />
      </UITopTools>
      <UIItems>
        <SidebarItem
          label="Home"
          onClick={() => {
            desktopRouter.navigate("home");
          }}
        />
        <SidebarItem
          label="Settings"
          onClick={() => {
            desktopRouter.navigate("settings");
          }}
        />
      </UIItems>
    </UIHolder>
  );
}

const UIHolder = styled(PresenceAnimator)`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 320px;
  ${theme.colors.layout.background.asBg};
  z-index: 2;
  padding-top: 24px;
`;

const UITopTools = styled.div`
  padding-top: 24px;
  padding-left: 16px;
`;

const UIItems = styled.div``;
