import React from "react";
import styled from "styled-components";

import { goToList } from "@aca/desktop/actions/lists";
import { closeNavigationMenu, goToSettings } from "@aca/desktop/actions/navigation";
import { inboxList } from "@aca/desktop/domains/list/preconfigured";
import { ActionIconButton } from "@aca/desktop/ui/ActionIconButton";
import { PresenceAnimator } from "@aca/ui/PresenceAnimator";
import { theme } from "@aca/ui/theme";

import { SidebarItem } from "./SidebarItem";

export function Sidebar() {
  return (
    <UIHolder presenceStyles={{ opacity: [0, 1], x: [-200, 0] }}>
      <UITopTools>
        <ActionIconButton action={closeNavigationMenu} />
      </UITopTools>
      <UIItems>
        <SidebarItem action={goToList} target={inboxList} />
        <SidebarItem action={goToSettings} />
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
