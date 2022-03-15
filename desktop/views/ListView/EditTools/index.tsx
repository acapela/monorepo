import React from "react";
import styled from "styled-components";

import { deleteNotificationList, renameNotificationList } from "@aca/desktop/actions/lists";
import { getDb } from "@aca/desktop/clientdb";
import { ActionIconButton } from "@aca/desktop/ui/ActionIconButton";
import { styledObserver } from "@aca/shared/component";
import { DAY, HOUR, MINUTE } from "@aca/shared/time";
import { SingleOptionDropdown } from "@aca/ui/forms/OptionsDropdown/single";
import { theme } from "@aca/ui/theme";

interface Props {
  listId: string;
  className?: string;
}

interface NotificationsIntervalOption {
  label: string;
  intervalMs: number | null;
}

const notificationIntervalOptions: NotificationsIntervalOption[] = [
  { label: `Don't notify`, intervalMs: null },
  { label: `Notify instantly`, intervalMs: 0 },
  { label: `Every 15 minutes`, intervalMs: MINUTE * 15 },
  { label: `Every hour`, intervalMs: HOUR },
  { label: `Every 3 hours`, intervalMs: HOUR * 3 },
  { label: `Once a day`, intervalMs: DAY },
];

export const ListEditTools = styledObserver(({ listId, className }: Props) => {
  const list = getDb().notificationList.assertFindById(listId);

  const selectedInterval =
    notificationIntervalOptions.find(
      (intervalOption) => intervalOption.intervalMs === list.notifications_interval_ms
    ) ?? notificationIntervalOptions[0];

  return (
    <UIHolder className={className}>
      <SingleOptionDropdown<NotificationsIntervalOption>
        items={notificationIntervalOptions}
        keyGetter={(intervalOption) => intervalOption.label}
        labelGetter={(intervalOption) => intervalOption.label}
        selectedItem={selectedInterval}
        onChange={(intervalOption) => {
          list.update({ notifications_interval_ms: intervalOption.intervalMs });
        }}
      />
      <ActionIconButton action={renameNotificationList} target={list} showTitleInTooltip />
      <ActionIconButton action={deleteNotificationList} target={list} showTitleInTooltip kind="primarySubtle" />
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  align-items: center;
  ${theme.spacing.actions.asGap}
`;
