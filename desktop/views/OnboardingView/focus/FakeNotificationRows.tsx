import React from "react";
import styled, { css } from "styled-components";

import { FakeContentAnimationsOrchestrator, FakeMenu, FakeRows } from "./fakeContent";

export interface FakeIntegrationScreenProps {
  count?: number;
}

export function FakeNotificationRows({ count = 3 }: FakeIntegrationScreenProps) {
  return (
    <UIHolder>
      <UISidebar>
        <FakeMenu count={3} />
        <FakeMenu count={3} />
      </UISidebar>
      <UIBody>
        <FakeRows count={count} />
      </UIBody>
    </UIHolder>
  );
}

const UIHolder = styled(FakeContentAnimationsOrchestrator)`
  min-height: 200px;
  display: flex;
  flex-direction: row;
`;

const spacing = css`
  padding: 20px;
`;

const UISidebar = styled.div`
  ${spacing};
  flex-grow: 1;
  max-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const UIBody = styled.div`
  ${spacing};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
