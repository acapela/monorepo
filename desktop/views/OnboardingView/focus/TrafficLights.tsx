import React from "react";
import styled from "styled-components";

const UIHolder = styled.div`
  display: flex;
  gap: 6px;
`;
const UILight = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 12px;
`;

export const trafficLights = (
  <UIHolder>
    <UILight style={{ backgroundColor: "#ED6A5E" }} />
    <UILight style={{ backgroundColor: "#F4BE4F" }} />
    <UILight style={{ backgroundColor: "#61C554" }} />
  </UIHolder>
);
