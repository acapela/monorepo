import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import {
  exitFocusMode,
  goToNextNotification,
  goToPreviousNotification,
  refreshNotificationPreview,
} from "@aca/desktop/actions/focus";
import { openNotificationInApp, resolveNotification } from "@aca/desktop/actions/notification";
import { toggleFocusModeStats } from "@aca/desktop/actions/settings";
import { snoozeNotification } from "@aca/desktop/actions/snooze";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { NotificationAppIcon } from "@aca/desktop/domains/notification/NotificationAppIcon";
import { getNotificationTitle } from "@aca/desktop/domains/notification/title";
import { SystemTopBar } from "@aca/desktop/ui/systemTopBar";
import { TopBarActionButton } from "@aca/desktop/ui/systemTopBar/TopBarActionButton";
import { TopBarDivider } from "@aca/desktop/ui/systemTopBar/ui";
import { niceFormatDateTime, relativeShortFormatDate } from "@aca/shared/dates/format";
import { theme } from "@aca/ui/theme";

interface Props {
  notification: NotificationEntity;
}

export const FocusModeTopBar = observer(({ notification }: Props) => {
  return (
    <SystemTopBar
      isFullWidth
      navigationItems={
        <>
          <TopBarActionButton action={exitFocusMode} />
          <TopBarDivider />
          <TopBarActionButton action={goToPreviousNotification} />
          <TopBarActionButton action={goToNextNotification} />
          <TopBarDivider />
          <TopBarActionButton action={toggleFocusModeStats} />
        </>
      }
      targetActionItems={
        <>
          <TopBarActionButton action={resolveNotification} />
          <TopBarActionButton action={snoozeNotification} />

          <TopBarDivider />
          <TopBarActionButton action={refreshNotificationPreview} />

          <TopBarActionButton action={openNotificationInApp} />
        </>
      }
      titleNode={
        <UIHeader>
          <NotificationAppIcon notification={notification} />
          <UITitle>
            {getNotificationTitle(notification)}{" "}
            <UIDate data-tooltip={niceFormatDateTime(new Date(notification.created_at))}>
              {relativeShortFormatDate(new Date(notification.created_at))}
            </UIDate>
          </UITitle>
        </UIHeader>
      }
    ></SystemTopBar>
  );
});

const UIHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;

  ${NotificationAppIcon} {
    ${theme.typo.secondaryTitle}
  }
`;

const UITitle = styled.div`
  ${theme.typo.content.medium};
  ${theme.common.ellipsisText}
  min-width: 0;
  flex-grow: 1;
`;

const UIDate = styled.span`
  opacity: 0.6;
`;
