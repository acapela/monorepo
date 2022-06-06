import { isNil } from "lodash";
import React from "react";
import styled from "styled-components";

import { trackEvent } from "@aca/desktop/analytics";
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
  { label: `Never`, intervalMs: null },
  { label: `Instantly `, intervalMs: 0 },
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

  const isEnabled = !isNil(list.notifications_interval_ms);
  return (
    <UIHolder className={className} data-tooltip="Notify about new items...">
      <SingleOptionDropdown<NotificationsIntervalOption>
        items={notificationIntervalOptions}
        keyGetter={(intervalOption) => intervalOption.label}
        labelGetter={(intervalOption) => intervalOption.label}
        selectedItem={selectedInterval}
        onChange={(intervalOption) => {
          list.update({ notifications_interval_ms: intervalOption.intervalMs });
          trackEvent("Desktop Notifications Settings Updated", { interval: intervalOption.intervalMs });
        }}
      >
        <TopBarButton
          key={`${isEnabled}`}
          icon={<IconBell />}
          kind={isEnabled ? "primarySubtle" : undefined}
          indicateNotification={isEnabled}
        />
      </SingleOptionDropdown>
    </UIHolder>
  );
})``;

const UIHolder = styled.div``;
