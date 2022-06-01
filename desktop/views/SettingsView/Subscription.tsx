import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { theme } from "@aca/ui/theme";

import { PremiumPlanView } from "../PremiumPlan/PremiumPlanView";

export const SubscriptionView = observer(() => {
  return (
    <UIHolder>
      <PremiumPlanView />
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  strong {
    ${theme.font.semibold}
  }
`;
