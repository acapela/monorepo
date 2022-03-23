import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { resolveNotification, unresolveNotification } from "@aca/desktop/actions/notification";
import { snoozeNotification, unsnoozeNotification } from "@aca/desktop/actions/snooze";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { NotificationsGroup } from "@aca/desktop/domains/group/group";
import { ActionIconButton } from "@aca/desktop/ui/ActionIconButton";

interface Props {
  target: NotificationEntity | NotificationsGroup;
}

export const RowQuickActions = observer(({ target }: Props) => {
  return (
    <UIHolder>
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
        action={snoozeNotification}
        target={target}
        showTitleInTooltip
        notApplicableMode="hide"
      />
      <ActionIconButton
        kind="transparent"
        size="compact"
        action={unsnoozeNotification}
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
