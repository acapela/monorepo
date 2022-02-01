import React, { ReactNode } from "react";

import { AppLayout } from "@aca/desktop/layout/AppLayout";

import { ListViewTray } from "./Tray";

interface Props {
  children: ReactNode;
  footer?: ReactNode;
}

export function TraySidebarLayout({ children, footer }: Props) {
  return (
    <>
      <AppLayout tray={<ListViewTray />} footer={footer}>
        {children}
      </AppLayout>
    </>
  );
}
