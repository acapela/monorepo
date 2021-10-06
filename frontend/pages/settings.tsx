import React from "react";

import { PageMeta } from "~frontend/utils/PageMeta";
import { SettingsView } from "~frontend/views/SettingsView";

export default function SettingsPage() {
  return (
    <>
      <PageMeta title="Settings" />
      <SettingsView />
    </>
  );
}
