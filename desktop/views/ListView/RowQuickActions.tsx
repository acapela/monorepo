import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import {
  addReminderToNotification,
  cancelSaveNotification,
  removeNotificationReminder,
  resolveNotification,
  saveNotification,
  unresolveNotification,
} from "@aca/desktop/actions/notification";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { NotificationsGroup } from "@aca/desktop/domains/group/group";
import { ActionIconButton } from "@aca/desktop/ui/ActionIconButton";

export interface RowQuickActionsProps {
  target: NotificationEntity | NotificationsGroup;
}

export const RowQuickActions = observer(({ target }: RowQuickActionsProps) => {
  return (
    <UIHolder>
      <ActionIconButton
        kind="transparent"
        size="compact"
        action={saveNotification}
        target={target}
        showTitleInTooltip
        notApplicableMode="hide"
      />
      <ActionIconButton
        kind="primarySubtle"
        size="compact"
        action={cancelSaveNotification}
        target={target}
        showTitleInTooltip
        notApplicableMode="hide"
      />
      <ActionIconButton
        kind="transparent"
        size="compact"
        action={resolveNotification}
        target={target}
        showTitleInTooltip
        notApplicableMode="hide"
      />
      <ActionIconButton
        kind="transparent"
        size="compact"
        action={addReminderToNotification}
        target={target}
        showTitleInTooltip
        notApplicableMode="hide"
      />
      <ActionIconButton
        kind="transparent"
        size="compact"
        action={removeNotificationReminder}
        target={target}
        showTitleInTooltip
        notApplicableMode="hide"
      />
      <ActionIconButton
        kind="transparent"
        size="compact"
        action={unresolveNotification}
        target={target}
        showTitleInTooltip
        notApplicableMode="hide"
      />
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
