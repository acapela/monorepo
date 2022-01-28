import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { toggleNavigationMenu } from "@aca/desktop/actions/navigation";
import { appStateStore } from "@aca/desktop/domains/appStateStore";
import { ActionIconButton } from "@aca/desktop/ui/ActionIconButton";

import { Sidebar } from "./Sidebar";

export const ListViewTray = observer(function ListViewTray() {
  const { isSidebarOpened } = appStateStore;
  return (
    <>
      <AnimatePresence>{isSidebarOpened && <Sidebar />}</AnimatePresence>

      <UIHolder>
        <ActionIconButton action={toggleNavigationMenu} />
      </UIHolder>
    </>
  );
});

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
