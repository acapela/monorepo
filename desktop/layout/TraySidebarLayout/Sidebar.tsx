import React from "react";
import styled from "styled-components";

import { closeNavigationMenu, goToSettings } from "@aca/desktop/actions/navigation";
import { inboxList, preconfiguredLists } from "@aca/desktop/domains/list/preconfigured";
import { ActionIconButton } from "@aca/desktop/ui/ActionIconButton";
import { ListTabLabel } from "@aca/desktop/views/ListView/ListTabLabel";
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
        <UIItemGroup>
          <UIListTabLabel list={inboxList} />
        </UIItemGroup>

        <UIItemGroup>
          {preconfiguredLists
            .filter((list) => list.id !== inboxList.id)
            .map((list) => {
              return <UIListTabLabel key={list.id} list={list} />;
            })}
        </UIItemGroup>

        <UISidebarItem action={goToSettings} />
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

const UIItemGroup = styled.div<{}>``;

const UITopTools = styled.div`
  padding-top: 24px;
  padding-left: 16px;
`;

const UIItems = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 72px;
  row-gap: 16px;
`;

const itemPadding = "padding: 12px 12px 12px 0;";

const UISidebarItem = styled(SidebarItem)`
  ${itemPadding}
`;

const UIListTabLabel = styled(ListTabLabel)`
  ${itemPadding}
`;
