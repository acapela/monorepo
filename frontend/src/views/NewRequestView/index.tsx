import React from "react";
import styled from "styled-components";

import { ClientSideOnly } from "~ui/ClientSideOnly";

import { SidebarLayout } from "../../layouts/SidebarLayout";
import { NewRequest } from "./NewRequest";

export function NewRequestView() {
  return (
    <SidebarLayout>
      <UIHolder>
        <ClientSideOnly>
          <NewRequest />
        </ClientSideOnly>
      </UIHolder>
    </SidebarLayout>
  );
}

const UIHolder = styled.div<{}>``;
