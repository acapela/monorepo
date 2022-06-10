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
  addReminderToNotification,
  cancelSaveNotification,
  openNotificationInApp,
  resolveNotification,
  saveNotification,
} from "@aca/desktop/actions/notification";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { getNotificationMeta } from "@aca/desktop/domains/notification/meta";
import { NotificationAppIcon } from "@aca/desktop/domains/notification/NotificationAppIcon";
import { NotificationTagDisplayer } from "@aca/desktop/domains/tag/NotificationTag";
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
  const { tags, title } = getNotificationMeta(notification);
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
          <TopBarActionButton action={addReminderToNotification} />
          <TopBarActionButton action={saveNotification} notApplicableMode="hide" />
          <TopBarActionButton action={cancelSaveNotification} notApplicableMode="hide" />

          <TopBarDivider />
          <TopBarActionButton action={refreshNotificationPreview} />

          <TopBarActionButton action={openNotificationInApp} />
        </>
      }
      titleNode={
        <UIHeader>
          <NotificationAppIcon notification={notification} />

          <UIFrom>{notification.from}</UIFrom>
          <UITitleLabel>{title}</UITitleLabel>

          <UIDate data-tooltip={niceFormatDateTime(new Date(notification.created_at))}>
            {relativeShortFormatDate(new Date(notification.created_at))}
          </UIDate>

          {tags && (
            <UITags style={{ minWidth: `${tags.length * 30 + 8}px` }}>
              {tags.map((tag) => {
                return <NotificationTagDisplayer key={tag.id} tag={tag} />;
              })}
            </UITags>
          )}
        </UIHeader>
      }
    ></SystemTopBar>
  );
});

const UIHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;

  ${NotificationAppIcon} {
    ${theme.typo.secondaryTitle}
  }
`;

const UITitleLabel = styled.div`
  ${theme.typo.content.medium};
  ${theme.common.ellipsisText};
  min-width: 0;
  flex-grow: 1;
  max-width: 400px;
  opacity: 0.6;
`;

const UIDate = styled.span`
  opacity: 0.6;
`;

const TAGS_GAP = 8;

const UITags = styled.div`
  display: flex;
  gap: ${TAGS_GAP}px;
  align-items: center;
  min-width: 0;
`;

const UIFrom = styled.div`
  ${theme.common.ellipsisText};
  min-width: 30px;
`;
