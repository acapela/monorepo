// TODO: add ".svg" types for CI to not complain
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import styled, { css } from "styled-components";

import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { uiStore } from "@aca/desktop/store/ui";
import { styledObserver } from "@aca/shared/component";
import { theme } from "@aca/ui/theme";

//@ts-ignore
import figma from "./figma.svg";
//@ts-ignore
import jira from "./jira.svg";
//@ts-ignore
import linear from "./linear.svg";
//@ts-ignore
import notion from "./notion.svg";
//@ts-ignore
import slack from "./slack.svg";

interface Props {
  notification: NotificationEntity;
  displayUnreadNotification?: boolean;
  isOnDarkBackground?: boolean;
  className?: string;
}

const notificationIcons: Record<Exclude<NotificationEntity["kind"], null>, { icon: string; isInvertable?: boolean }> = {
  notification_slack_message: { icon: slack },
  notification_figma_comment: { icon: figma },
  notification_notion: { icon: notion, isInvertable: true },
  notification_linear: { icon: linear },
  notification_jira_issue: { icon: jira },
};

const log = makeLogger("Notification App Icon");

export const NotificationAppIcon = styledObserver(function NotificationAppIcon({
  notification,
  className,
  isOnDarkBackground = uiStore.isInDarkMode,
  displayUnreadNotification = false,
}: Props) {
  const targetNotification = notification.inner;

  const unknownNode = <UIUnknown className={className}>?</UIUnknown>;

  if (!targetNotification) {
    log.error(`unable to find inner notification for notification id ${notification.id}`);
    return unknownNode;
  }

  const { icon, isInvertable } = notificationIcons[targetNotification.__typename];

  return (
    <UIHolder>
      <UIIcon
        className={[className, notification.inner?.__typename].join(" ")}
        src={icon}
        $invert={Boolean(isOnDarkBackground && isInvertable)}
      />

      {displayUnreadNotification && <UIUnreadIndicator />}
    </UIHolder>
  );
})``;

const iconStyles = css`
  height: 1em;
  width: 1em;
`;

const UIHolder = styled.div`
  position: relative;
`;

const UIIcon = styled.img<{ $invert?: boolean }>`
  ${iconStyles};

  &.notification_notion {
    background-color: #fff;
    border-radius: 4px;
  }
`;

const UIUnknown = styled.div`
  ${iconStyles}
`;

export const UIUnreadIndicator = styled.div<{}>`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 10px;
  height: 10px;
  border: 1px solid ${theme.colors.layout.background.value};

  ${theme.colors.primary.asBg}

  ${theme.radius.circle}
`;
