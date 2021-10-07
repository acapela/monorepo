import React from "react";

import { SidebarLayout } from "~frontend/layouts/SidebarLayout";
import { PageMeta } from "~frontend/utils/PageMeta";
import { SettingsView } from "~frontend/views/SettingsView";

export default function SettingsPage() {
  return (
    <>
      <PageMeta title="Settings" />
      <SidebarLayout>
        <SettingsView />
      </SidebarLayout>
    </>
  );
}
