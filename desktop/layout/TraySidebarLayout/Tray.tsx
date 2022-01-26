import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import styled from "styled-components";

import { IconButton } from "@aca/ui/buttons/IconButton";
import { IconMenu } from "@aca/ui/icons";

import { Sidebar } from "./Sidebar";

export function ListViewTray() {
  const [isSidebarOpened, setIsSidebarOpened] = useState(false);
  return (
    <>
      <AnimatePresence>
        {isSidebarOpened && <Sidebar onCloseRequest={() => setIsSidebarOpened(false)} />}
      </AnimatePresence>

      <UIHolder>
        <IconButton icon={<IconMenu />} onClick={() => setIsSidebarOpened(true)} />
      </UIHolder>
    </>
  );
}

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
