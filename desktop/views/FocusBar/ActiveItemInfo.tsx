import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { openNotificationInApp } from "@aca/desktop/actions/notification";
import { getPrimaryNotification } from "@aca/desktop/domains/group/group";
import { NotificationOrGroup } from "@aca/desktop/domains/group/groupNotifications";
import { NotificationAppIcon } from "@aca/desktop/domains/notification/NotificationAppIcon";
import { getNotificationTitle } from "@aca/desktop/domains/notification/title";
import { runActionWith } from "@aca/desktop/domains/runAction";
import { niceFormatDateTime, relativeShortFormatDate } from "@aca/shared/dates/format";
import { theme } from "@aca/ui/theme";

interface Props {
  item: NotificationOrGroup;
}

export const FocusBarActiveItemInfo = observer(({ item }: Props) => {
  const notification = getPrimaryNotification(item);
  return (
    <UIWrapper>
      <UIHeader
        onClick={() => {
          runActionWith(openNotificationInApp, notification);
        }}
      >
        <NotificationAppIcon notification={notification} />
        <UITitle>
          {getNotificationTitle(notification)}{" "}
          <UIDate data-tooltip={niceFormatDateTime(new Date(notification.created_at))}>
            {relativeShortFormatDate(new Date(notification.created_at))}
          </UIDate>
        </UITitle>
      </UIHeader>
    </UIWrapper>
  );
});

const UIWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  min-width: 0;
  ${theme.common.dragWindow};
`;

const UIHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;

  ${theme.colors.action.transparent.interactive};
  color: inherit;
  padding: 5px 12px;
  border-radius: 6px;
  ${theme.transitions.hover()}

  ${NotificationAppIcon} {
    ${theme.iconSize.item};
  }
`;

const UITitle = styled.div`
  ${theme.typo.body.medium};
  ${theme.common.ellipsisText}
  min-width: 0;
  flex-grow: 1;
`;

const UIDate = styled.span`
  opacity: 0.6;
`;
