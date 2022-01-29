import React, { ReactNode } from "react";
import styled from "styled-components";

import { ActionData, runAction } from "@aca/desktop/actions/action";
import { createActionContext } from "@aca/desktop/actions/action/context";
import { styledObserver } from "@aca/shared/component";
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
export const ActionTrigger = styledObserver<Props>(function ActionTrigger({
  action,
  target,
  children,
  className,
  onMouseEnter,
  onMouseLeave,
}: Props) {
  const context = createActionContext(target);

  return (
    <UIHolder
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={className}
      onClick={() => {
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
