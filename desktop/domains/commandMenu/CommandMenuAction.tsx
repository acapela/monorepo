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
            <IconChevronRight /> <UIEllipsis>{supplementaryLabel}</UIEllipsis>
          </UIInfo>
        )}
      </UIName>

      {shortcut && <UIShortcut shortcut={shortcut} />}
    </UIHolder>
  );
});

const UIIcon = styled.div`
  ${theme.iconSize.item};
  transition: 0.2s all;
  ${theme.colors.layout.backgroundAccent.active.asBg}
  padding: 0.2em;
  border-radius: 6px;
`;

const UIHolder = styled(motion.div)<{ $isActive: boolean }>`
  ${theme.box.items.primarySelectItem.size.padding};
  ${theme.typo.body.medium};
  display: flex;
  gap: 15px;
  align-items: center;
  border-left: 2px solid transparent;

  ${UIIcon} {
    opacity: ${(props) => (props.$isActive ? 1 : 0.75)};
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
  gap: 8px;
  ${theme.common.ellipsisText}
`;

const UIEllipsis = styled.div`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UIShortcut = styled(ShortcutDescriptor)`
  ${theme.typo.body.semibold};
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

const UIInfo = styled.div`
  display: flex;
  align-items: center;
  opacity: 0.5;

  min-width: 0;
`;
