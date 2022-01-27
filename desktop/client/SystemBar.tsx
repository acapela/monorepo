import React from "react";
import styled from "styled-components";

import { toggleMaximize } from "../bridge/system";

export function SystemBar() {
  return (
    <UIBar
      onDoubleClick={() => {
        toggleMaximize();
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
`;
