import React, { ReactNode } from "react";

import { AppLayout } from "@aca/desktop/layout/AppLayout";

import { ListViewTray } from "./Tray";

interface Props {
  children: ReactNode;
}

export function TraySidebarLayout({ children }: Props) {
  return (
    <>
      <AppLayout tray={<ListViewTray />} footer={null}>
        {children}
      </AppLayout>
    </>
  );
}
