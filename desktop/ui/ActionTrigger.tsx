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

/**
 * Element that will run action if clicked, but can have any custom children.
 *
 * Useful for rendering action buttons that have custom UI (nor Button or IconButton, etc.)
 */
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
