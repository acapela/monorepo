import React from "react";
import styled from "styled-components";

import { SidebarLayout } from "~frontend/layouts/SidebarLayout";
import { PageMeta } from "~frontend/utils/PageMeta";
import { SettingsView } from "~frontend/views/SettingsView";

export default function SettingsPage() {
  return (
    <>
      <PageMeta title="Settings" />
      <SidebarLayout>
        <UIHolder>
          <SettingsView />
        </UIHolder>
      </SidebarLayout>
    </>
  );
}

const UIHolder = styled.div`
  max-width: 1200px;
  width: 100%;
  align-self: center;
`;
