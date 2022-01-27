import React, { ReactNode } from "react";
import styled from "styled-components";

import { ActionData, runAction } from "@aca/desktop/actions/action";
import { createActionContext } from "@aca/desktop/actions/action/context";
import { styledObserver } from "@aca/shared/component";

interface Props {
  action: ActionData;
  target?: unknown;
  children: ReactNode;
}

export const ActionTrigger = styledObserver(function ActionTrigger({ action, target, children }: Props) {
  const context = createActionContext(target);

  return (
    <UIHolder
      onClick={() => {
        runAction(action, context);
      }}
    >
      {children}
    </UIHolder>
  );
})``;

const UIHolder = styled.div``;
