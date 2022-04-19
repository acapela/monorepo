import React, { ReactNode } from "react";
import styled from "styled-components";

import { theme } from "@aca/ui/theme";

import { trafficLights } from "./TrafficLights";

interface Props {
  topBar: ReactNode;
  children: ReactNode;
}

export function FakeWindow({ topBar, children }: Props) {
  return (
    <UIHolder>
      <UITopBar>
        {trafficLights}
        <UITopbarBody>{topBar}</UITopbarBody>
      </UITopBar>
      <UIBody>{children}</UIBody>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  border: 1px solid #888888;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 22px 70px 4px rgba(0, 0, 0, 0.56);
`;

const UITopBar = styled.div`
  height: 52px;
  display: flex;
  align-items: center;
  padding: 0 19px;
  gap: 20px;
  border-bottom: 1px solid ${theme.colors.layout.divider.value};
`;

const UITopbarBody = styled.div`
  flex-grow: 1;
`;

const UIBody = styled.div``;
