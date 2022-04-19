import React, { useRef } from "react";
import styled from "styled-components";

import { useUserFocusedOnElement } from "@aca/shared/hooks/useUserFocusedOnElement";
import { IconButton } from "@aca/ui/buttons/IconButton";
import { IconCheck, IconTime } from "@aca/ui/icons";
import { useShortcut } from "@aca/ui/keyboard/useShortcut";
import { theme } from "@aca/ui/theme";

import { OnboardingNotificationRowData } from "./types";

interface Props {
  notification: OnboardingNotificationRowData;
  onSelectRequest: () => void;
  onDeselectRequest: () => void;
  isSelected: boolean;
}

export function OnboardingNotificationRow({ notification, onSelectRequest, onDeselectRequest, isSelected }: Props) {
  const { integration, author, target, content, onOpen, onResolve, onSnooze } = notification;
  const holderRef = useRef<HTMLDivElement>(null);
  useUserFocusedOnElement(holderRef, onSelectRequest, onDeselectRequest);

  useShortcut("E", () => onResolve?.(notification), { isEnabled: isSelected });
  useShortcut(
    "H",
    () => {
      onSnooze?.(notification);
      return true;
    },
    { isEnabled: isSelected }
  );
  useShortcut("Enter", () => onOpen?.(notification), { isEnabled: isSelected });

  return (
    <UIHolder
      ref={holderRef}
      $isSelected={isSelected}
      onClick={() => {
        onOpen?.(notification);
      }}
    >
      <UIIcon>{integration.icon}</UIIcon>
      <UIAuthor>{author}</UIAuthor>
      <UITarget>{target}</UITarget>
      <UIContent>{content}</UIContent>
      <UITime>1m</UITime>
      {isSelected && (
        <UIActions>
          <IconButton
            kind="transparent"
            size="compact"
            icon={<IconCheck />}
            tooltip="Resolve notification"
            onClick={() => onResolve?.(notification)}
          />
          <IconButton
            kind="transparent"
            size="compact"
            icon={<IconTime />}
            tooltip="Snooze notification..."
            onClick={() => onSnooze?.(notification)}
          />
        </UIActions>
      )}
    </UIHolder>
  );
}

const UIHolder = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  gap: 10px;
  height: 48px;
  padding: 0 20px;
  ${(props) => props.$isSelected && theme.colors.layout.backgroundAccent.hover.asBgWithReadableText};
`;
const UIIcon = styled.div`
  font-size: 20px;
`;
const UIAuthor = styled.div`
  width: 60px;
  min-width: 60px;
`;
const UITarget = styled.div`
  width: 90px;
  min-width: 90px;
  opacity: 0.7;
`;
const UIContent = styled.div`
  white-space: nowrap;
  gap: 1ch;
  flex-grow: 1;
  min-width: 0;
  ${theme.common.ellipsisText};

  & > * {
    display: inline-block;
    vertical-align: unset;
  }
`;
const UITime = styled.div`
  opacity: 0.7;
`;
const UIActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
