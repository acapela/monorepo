import React, { ReactNode } from "react";

import { AppLayout } from "@aca/desktop/layout/AppLayout";

import { ListViewSidebar } from "./Tray";

interface Props {
  children: ReactNode;
  footer?: ReactNode;
}

export function TraySidebarLayout({ children, footer }: Props) {
  return (
    <>
      <AppLayout sidebar={<ListViewSidebar />} footer={footer}>
        {children}
      </AppLayout>
    </>
  );
}
