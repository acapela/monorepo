import { isNil } from "lodash";
import React from "react";
import styled from "styled-components";

import { NotificationListEntity } from "@aca/desktop/clientdb/list";
import { TopBarButton } from "@aca/desktop/ui/systemTopBar/TopBarButton";
import { styledObserver } from "@aca/shared/component";
import { DAY, HOUR, MINUTE } from "@aca/shared/time";
import { SingleOptionDropdown } from "@aca/ui/forms/OptionsDropdown/single";
import { IconBell } from "@aca/ui/icons";

interface Props {
  list: NotificationListEntity;
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

export const ListNotificationsSettings = styledObserver(({ list, className }: Props) => {
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
      >
        <TopBarButton icon={<IconBell />} indicateNotification={!isNil(list.notifications_interval_ms)} />
      </SingleOptionDropdown>
    </UIHolder>
  );
})``;

const UIHolder = styled.div``;
