import React from "react";
import styled from "styled-components";

import { SidebarLayout } from "~frontend/layouts/SidebarLayout";

export function SettingsView() {
  return (
    <SidebarLayout>
      <UIHolder>Settings</UIHolder>
    </SidebarLayout>
  );
}

const UIHolder = styled.div<{}>``;
