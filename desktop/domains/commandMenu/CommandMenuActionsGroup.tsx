import { motion } from "framer-motion";
import { observer } from "mobx-react";
import React, { useLayoutEffect, useRef } from "react";
import styled from "styled-components";

import { ActionData } from "@aca/desktop/actions/action";
import { ActionGroupData, resolveGroupData } from "@aca/desktop/actions/action/group";
import { makeElementVisible } from "@aca/shared/interactionUtils";
import { theme } from "@aca/ui/theme";

import { CommandMenuAction } from "./CommandMenuAction";
import { CommandMenuSession } from "./session";

interface Props {
  session: CommandMenuSession;
  group?: ActionGroupData;
  actions: ActionData[];
  activeAction?: ActionData;
  onSelectRequest: (action: ActionData) => void;
  onApplyRequest: (action: ActionData) => void;
}

export const CommandMenuActionsGroup = observer(function CommandMenuActionsGroup({
  group,
  actions,
  session,
  activeAction,
  onSelectRequest,
  onApplyRequest,
}: Props) {
  const groupTitleRef = useRef<HTMLDivElement>(null);
  const groupName = group ? resolveGroupData(group, session.actionContext).name : undefined;

  const isFirstElementActive = activeAction && actions[0].id === activeAction?.id;

  // If first element is active - make sure to also show group name
  useLayoutEffect(() => {
    if (isFirstElementActive) {
      makeElementVisible(groupTitleRef.current);
    }
  }, [isFirstElementActive]);

  return (
    <UIHolder>
      {groupName && <UIGroupLabel ref={groupTitleRef}>{groupName}</UIGroupLabel>}
      {actions.map((action) => {
        return (
          <CommandMenuAction
            key={action.id}
            action={action}
            session={session}
            isActive={activeAction?.id === action.id}
            onApplyRequest={() => onApplyRequest(action)}
            onSelectRequest={() => onSelectRequest(action)}
          />
        );
      })}
    </UIHolder>
  );
});

const UIHolder = styled(motion.div)``;

const UIGroupLabel = styled.div`
  padding: 6px 24px;
  ${theme.typo.note.semibold.secondary}
  ${theme.colors.layout.actionPanel.hover.asBg};
  ${theme.common.ellipsisText}
`;
