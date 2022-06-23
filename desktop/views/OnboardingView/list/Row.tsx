import React, { useRef } from "react";
import styled from "styled-components";

import { addReminderToNotification, openFocusMode, resolveNotification } from "@aca/desktop/actions/notification";
import { IntegrationIcon } from "@aca/desktop/domains/integrations/IntegrationIcon";
import { NotificationTagsList } from "@aca/desktop/domains/tag/NotificationTagsList";
import { NotificationTag } from "@aca/desktop/domains/tag/tag";
import { useUserFocusedOnElement } from "@aca/shared/hooks/useUserFocusedOnElement";
import { IconButton } from "@aca/ui/buttons/IconButton";
import { IconBell, IconCheck } from "@aca/ui/icons";
import { useShortcut } from "@aca/ui/keyboard/useShortcut";
import { theme } from "@aca/ui/theme";

import { OnboardingNotificationRowData } from "./types";

/**
 * Fake notification row
 */

interface Props {
  notification: OnboardingNotificationRowData;
  onSelectRequest: () => void;
  onDeselectRequest: () => void;
  isSelected: boolean;
  tags?: NotificationTag[];
}

export function OnboardingNotificationRow({
  notification,
  onSelectRequest,
  onDeselectRequest,
  isSelected,
  tags,
}: Props) {
  const { integration, author, content, timeAgoSent, onOpen, onResolve, onAddReminder } = notification;
  const holderRef = useRef<HTMLDivElement>(null);
  useUserFocusedOnElement(holderRef, onSelectRequest, onDeselectRequest);

  useShortcut(resolveNotification.shortcut!, () => onResolve?.(notification), { isEnabled: isSelected });
  useShortcut(
    addReminderToNotification.shortcut!,
    () => {
      onAddReminder?.(notification);
      return true;
    },
    { isEnabled: isSelected }
  );
  useShortcut(openFocusMode.shortcut!, () => onOpen?.(notification), { isEnabled: isSelected });

  return (
    <UIHolder
      ref={holderRef}
      $isSelected={isSelected}
      onClick={() => {
        onOpen?.(notification);
      }}
    >
      <UIIcon>
        <IntegrationIcon integrationClient={integration} />
      </UIIcon>

      <UIAuthor>{author}</UIAuthor>
      {!!tags && (
        <UITags>
          <NotificationTagsList tags={tags} />
        </UITags>
      )}
      <UIContent>{content}</UIContent>
      <UITime>{timeAgoSent}</UITime>
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
            icon={<IconBell />}
            tooltip="Add reminder..."
            onClick={() => onAddReminder?.(notification)}
          />
        </UIActions>
      )}
    </UIHolder>
  );
}

const UIHolder = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  font-weight: 500;
  gap: 10px;
  height: 48px;
  padding: 0 20px;
  ${(props) => props.$isSelected && theme.colors.layout.backgroundAccent.hover.asBg};
`;
const UIIcon = styled.div`
  ${theme.iconSize.item};
`;
const UIAuthor = styled.div`
  width: 60px;
  min-width: 60px;
`;
const UITags = styled.div``;
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
