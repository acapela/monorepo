import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { resolveNotification } from "@aca/desktop/actions/notification";
import { snoozeNotification } from "@aca/desktop/actions/snooze";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { NotificationsGroup } from "@aca/desktop/domains/group/group";
import { ActionIconButton } from "@aca/desktop/ui/ActionIconButton";

interface Props {
  target: NotificationEntity | NotificationsGroup;
}

export const RowQuickActions = observer(({ target }: Props) => {
  return (
    <UIHolder>
      <ActionIconButton kind="transparent" action={resolveNotification} target={target} showTitleInTooltip />
      <ActionIconButton kind="transparent" action={snoozeNotification} target={target} showTitleInTooltip />
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  align-items: center;
`;
