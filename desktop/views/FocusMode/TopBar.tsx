import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import {
  exitFocusMode,
  goToNextNotification,
  goToPreviousNotification,
  refreshNotificationPreview,
} from "@aca/desktop/actions/focus";
import {
  cancelSaveNotification,
  openNotificationInApp,
  resolveNotification,
  saveNotification,
  snoozeNotification,
} from "@aca/desktop/actions/notification";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { NotificationAppIcon } from "@aca/desktop/domains/notification/NotificationAppIcon";
import { getNotificationTitle } from "@aca/desktop/domains/notification/title";
import { SystemTopBar } from "@aca/desktop/ui/systemTopBar";
import { ComposeButton } from "@aca/desktop/ui/systemTopBar/ComposeButton";
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
          <ComposeButton />
        </>
      }
      targetActionItems={
        <>
          <TopBarActionButton action={resolveNotification} />
          <TopBarActionButton action={snoozeNotification} />
          <TopBarActionButton action={saveNotification} />
          <TopBarActionButton action={cancelSaveNotification} />

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
