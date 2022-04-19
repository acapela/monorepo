import { motion } from "framer-motion";
import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import styled, { css } from "styled-components";

import { ActionData, resolveActionData } from "@aca/desktop/actions/action";
import { useUserFocusedOnElement } from "@aca/shared/hooks/useUserFocusedOnElement";
import { makeElementVisible } from "@aca/shared/interactionUtils";
import { IconArrowRight, IconChevronRight } from "@aca/ui/icons";
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
  const { name, shortcut, icon, supplementaryLabel } = resolveActionData(action, session.actionContext);

  useUserFocusedOnElement(elementRef, () => {
    onSelectRequest();
  });

  useEffect(() => {
    if (!isActive) return;
    makeElementVisible(elementRef.current);
  }, [isActive]);
  return (
    <UIHolder $isActive={isActive} ref={elementRef} onClick={onApplyRequest}>
      <UIIcon>{icon ?? <IconArrowRight />}</UIIcon>
      <UIName>
        {name}{" "}
        {supplementaryLabel && (
          <UIInfo>
            <IconChevronRight /> {supplementaryLabel}
          </UIInfo>
        )}
      </UIName>

      {shortcut && <UIShortcut shortcut={shortcut} />}
    </UIHolder>
  );
});

const UIIcon = styled.div`
  font-size: 1.33em;
  transition: 0.2s all;
  ${theme.colors.layout.backgroundAccent.active.asBg}
  padding: 0.2em;
  border-radius: 6px;
`;

const UIHolder = styled(motion.div)<{ $isActive: boolean }>`
  ${theme.box.items.primarySelectItem.size.padding};
  ${theme.typo.content.medium};
  display: flex;
  gap: 15px;
  align-items: center;
  border-left: 2px solid #fff0;

  ${UIIcon} {
    opacity: ${(props) => (props.$isActive ? 1 : 0.75)};
    /* transform: scale(${(props) => (props.$isActive ? 1.15 : 1)}); */
    /* color: ${(props) => (props.$isActive ? theme.colors.primary.value : "inherit")}; */
  }

  ${(props) =>
    props.$isActive &&
    css`
      ${theme.colors.layout.actionPanel.active.asBg}
      border-left-color: ${theme.colors.primary.value};
    `}
`;

const UIName = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  ${theme.common.ellipsisText}
`;

const UIShortcut = styled(ShortcutDescriptor)`
  ${theme.typo.content.semibold};
  .key {
    transition: 0.2s all;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    ${theme.box.panel.shortcut.size.padding.radius};
    text-align: center;
    ${theme.radius.badge};
    min-width: 2ch;
  }
`;

const UIInfo = styled.span`
  display: inline-flex;
  align-items: center;
  opacity: 0.5;
`;
