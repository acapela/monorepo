import React from "react";
import styled from "styled-components";

import { ClientSideOnly } from "~ui/ClientSideOnly";

import { NewRequest } from "./NewRequest";

export function NewRequestView() {
  return (
    <UIHolder>
      <ClientSideOnly>
        <NewRequest />
      </ClientSideOnly>
    </UIHolder>
  );
}

const UIHolder = styled.div<{}>``;
