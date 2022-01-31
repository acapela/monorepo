import React from "react";
import styled from "styled-components";

import { toggleMaximizeRequest } from "@aca/desktop/bridge/system";

export function SystemBar() {
  return (
    <UIBar
      onDoubleClick={() => {
        toggleMaximizeRequest();
      }}
    ></UIBar>
  );
}

const UIBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 24px;
  -webkit-app-region: drag;
  z-index: 2;
`;
