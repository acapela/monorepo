import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { openNotificationInApp } from "@aca/desktop/actions/notification";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { NotificationAppIcon } from "@aca/desktop/domains/notification/NotificationAppIcon";
import { getNotificationTitle } from "@aca/desktop/domains/notification/title";
import { runActionWith } from "@aca/desktop/domains/runAction";
import { niceFormatDateTime, relativeShortFormatDate } from "@aca/shared/dates/format";
import { theme } from "@aca/ui/theme";

interface Props {
  item: NotificationEntity;
}

export const FocusBarActiveItemInfo = observer(({ item }: Props) => {
  return (
    <UIWrapper>
      <UIHeader
        onClick={() => {
          runActionWith(openNotificationInApp, item);
        }}
      >
        <NotificationAppIcon notification={item} />
        <UITitle>
          {getNotificationTitle(item)}{" "}
          <UIDate data-tooltip={niceFormatDateTime(new Date(item.created_at))}>
            {relativeShortFormatDate(new Date(item.created_at))}
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
