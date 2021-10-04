import React from "react";
import styled from "styled-components";

import { ClientSideOnly } from "~ui/ClientSideOnly";

import { SidebarLayout } from "./Layout";
import { NewRequest } from "./newRequest/newRequest";
import { SidebarContent } from "./sidebar/SidebarContent";

export function NewRequestView() {
  return (
    <SidebarLayout sidebarContent={<SidebarContent />}>
      <UIHolder>
        <ClientSideOnly>
          <NewRequest />
        </ClientSideOnly>
      </UIHolder>
    </SidebarLayout>
  );
}

const UIHolder = styled.div<{}>``;
