import React, { ReactNode } from "react";
import styled from "styled-components";

import { showContextMenuRequest } from "@aca/desktop/bridge/menu";

interface Props {
  children: ReactNode;
}

export function ContextMenuTrigger({ children }: Props) {
  return (
    <UIHolder
      onContextMenuCapture={(event) => {
        event.preventDefault();
        showContextMenuRequest([{ label: "Foo2" }]);
      }}
    >
      {children}
    </UIHolder>
  );
}

const UIHolder = styled.div``;
