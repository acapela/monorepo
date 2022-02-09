import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { openNavigationMenu } from "@aca/desktop/actions/navigation";
import { uiStore } from "@aca/desktop/store/ui";
import { ActionIconButton } from "@aca/desktop/ui/ActionIconButton";

import { Sidebar } from "./Sidebar";

export const ListViewTray = observer(function ListViewTray() {
  const { isSidebarOpened } = uiStore;
  return (
    <>
      <AnimatePresence>{isSidebarOpened && <Sidebar />}</AnimatePresence>

      <UIHolder>
        <ActionIconButton action={openNavigationMenu} />
      </UIHolder>
    </>
  );
});

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
