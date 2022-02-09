import { observer } from "mobx-react";
import React, { useRef } from "react";
import { useClickAway } from "react-use";
import styled from "styled-components";

import { goToList } from "@aca/desktop/actions/lists";
import { closeNavigationMenu, goToSettings } from "@aca/desktop/actions/navigation";
import { allNotificationsList, getInboxLists, outOfInboxLists } from "@aca/desktop/domains/list/all";
import { runAction } from "@aca/desktop/domains/runAction";
import { ActionIconButton } from "@aca/desktop/ui/ActionIconButton";
import { ScreenCover } from "@aca/ui/Modal/ScreenCover";
import { PresenceAnimator } from "@aca/ui/PresenceAnimator";
import { theme } from "@aca/ui/theme";

import { SidebarItem } from "./SidebarItem";

export const Sidebar = observer(() => {
  const sideBarRef = useRef<HTMLDivElement | null>(null);

  useClickAway(sideBarRef, (e) => {
    e.preventDefault();
    e.stopPropagation();
    runAction(closeNavigationMenu);
  });

  return (
    <ScreenCover>
      <UIHolder ref={sideBarRef} presenceStyles={{ opacity: [0, 1], x: [-200, 0] }}>
        <UITopTools>
          <ActionIconButton action={closeNavigationMenu} />
        </UITopTools>
        <UIItems>
          <UIItemGroup>
            <UISidebarItem action={goToList} target={allNotificationsList} />
          </UIItemGroup>

          <UIItemGroup>
            {getInboxLists()
              .filter((list) => list.id !== allNotificationsList.id)
              .map((list) => (
                <UISidebarItem key={list.id} action={goToList} target={list} />
              ))}
          </UIItemGroup>
          <UIItemGroup>
            {outOfInboxLists.map((list) => (
              <UISidebarItem key={list.id} action={goToList} target={list} />
            ))}
          </UIItemGroup>

          <UISidebarItem action={goToSettings} />
        </UIItems>
      </UIHolder>
    </ScreenCover>
  );
});

const UIHolder = styled(PresenceAnimator)`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 320px;
  ${theme.colors.layout.background.asBg};
  ${theme.shadow.popover};
  ${theme.radius.panel};
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

const UISidebarItem = styled(SidebarItem)`
  padding: 12px 12px 12px 0;
`;
