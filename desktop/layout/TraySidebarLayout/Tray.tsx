import { observer } from "mobx-react";
import React from "react";

import { uiStore } from "@aca/desktop/store/ui";

import { Sidebar } from "./Sidebar";

export const ListViewSidebar = observer(function ListViewTray() {
  const { isSidebarOpened } = uiStore;
  return (
    <>
      <Sidebar isOpened={isSidebarOpened} />
    </>
  );
});
