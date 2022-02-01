import { motion } from "framer-motion";
import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { ActionData, resolveActionData } from "@aca/desktop/actions/action";
import { useUserFocusedOnElement } from "@aca/shared/hooks/useUserFocusedOnElement";
import { IconArrowRight } from "@aca/ui/icons";
import { ShortcutDescriptor } from "@aca/ui/keyboard/ShortcutLabel";
import { theme } from "@aca/ui/theme";

import { CommandMenuSession } from "./session";

interface Props {
  action: ActionData;
  session: CommandMenuSession;
  isActive: boolean;
  onSelectRequest: () => void;
  onApplyRequest: () => void;
}

export const CommandMenuAction = observer(function CommandMenuAction({
  action,
  session,
  isActive,
  onSelectRequest,
  onApplyRequest,
}: Props) {
  const elementRef = useRef<HTMLDivElement>(null);
  const { name, shortcut, icon } = resolveActionData(action, session.actionContext);

  useUserFocusedOnElement(elementRef, () => {
    onSelectRequest();
  });

  useEffect(() => {
    if (!isActive) return;
    elementRef.current?.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
  }, [isActive]);
  return (
    <UIHolder $isActive={isActive} ref={elementRef} onClick={onApplyRequest}>
      <UIIcon>{icon ?? <IconArrowRight />}</UIIcon>
      <UIName>{name}</UIName>
      {shortcut && <UIShortcut shortcut={shortcut} />}
    </UIHolder>
  );
});

const UIHolder = styled(motion.div)<{ $isActive: boolean }>`
  padding: 16px 24px;
  ${theme.typo.content.medium};
  display: flex;
  ${theme.spacing.actions.asGap};
  align-items: center;

  ${(props) => props.$isActive && theme.colors.layout.actionPanel.active.asBg}
`;

const UIIcon = styled.div`
  font-size: 1.5em;
`;

const UIName = styled.div`
  flex-grow: 1;
`;

const UIShortcut = styled(ShortcutDescriptor)`
  gap: 4px;
  ${theme.typo.label.semibold};
  .key {
    line-height: 1;
    ${theme.colors.layout.actionPanel.active.asBg};
    ${theme.box.hint};
    ${theme.radius.badge};
    min-width: 2.5ch;
  }
`;
