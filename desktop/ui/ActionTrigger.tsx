import React, { ReactNode } from "react";
import styled from "styled-components";

import { ActionData } from "@aca/desktop/actions/action";
import { createActionContext } from "@aca/desktop/actions/action/context";
import { runAction } from "@aca/desktop/domains/runAction";
import { styledObserverForwardRef } from "@aca/shared/component";
import { theme } from "@aca/ui/theme";

interface Props {
  action: ActionData;
  target?: unknown;
  children: ReactNode;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/**
 * Element that will run action if clicked, but can have any custom children.
 *
 * Useful for rendering action buttons that have custom UI (nor Button or IconButton, etc.)
 */
export const ActionTrigger = styledObserverForwardRef<HTMLDivElement, Props>(function ActionTrigger(
  { action, target, children, className, onMouseEnter, onMouseLeave },
  ref
) {
  const context = createActionContext(target);

  return (
    <UIHolder
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={className}
      onClick={(event) => {
        event.stopPropagation();
        runAction(action, context);
      }}
    >
      {children}
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  ${theme.common.clickable};
`;
