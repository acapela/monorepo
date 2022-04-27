// TODO: add ".svg" types for CI to not complain
/* eslint-disable @typescript-eslint/ban-ts-comment */

import React from "react";
import styled, { css } from "styled-components";

import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { getDb } from "@aca/desktop/clientdb";
import { NotificationEntity, NotificationInner } from "@aca/desktop/clientdb/notification";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { uiStore } from "@aca/desktop/store/ui";
import { styledObserver } from "@aca/shared/component";

const {
  figma,
  jira,
  linear,
  notion,
  slack,
  github,
  gmail,
  asana,
  drive,
  driveDocs,
  drivePresentation,
  driveSpreadsheet,
  driveForms,
  driveJamboard,
} = integrationLogos;

interface Props {
  notification: NotificationEntity;
  displayUnreadNotification?: boolean;
  isOnDarkBackground?: boolean;
  className?: string;
}

function getIconSource(notification: NotificationInner, isOnDarkBackground: boolean) {
  if (notification.__typename === "notification_slack_message") {
    return { icon: slack, isInverted: false };
  }

  if (notification.__typename === "notification_figma_comment") {
    return { icon: figma, isInverted: false };
  }

  if (notification.__typename === "notification_notion") {
    return { icon: notion, isInverted: isOnDarkBackground };
  }

  if (notification.__typename === "notification_linear") {
    return { icon: linear, isInverted: false };
  }

  if (notification.__typename === "notification_jira_issue") {
    return { icon: jira, isInverted: false };
  }

  if (notification.__typename === "notification_github") {
    return { icon: github, isInverted: false };
  }

  if (notification.__typename === "notification_gmail") {
    return { icon: gmail, isInverted: false };
  }

  if (notification.__typename === "notification_asana") {
    return { icon: asana, isInverted: false };
  }

  if (notification.__typename === "notification_drive") {
    const driveFile = getDb().googleDriveFile.findById(notification.google_drive_file_id);
    if (driveFile?.source === "presentation") {
      return { icon: drivePresentation, isInverted: false };
    }
    if (driveFile?.source === "spreadsheets") {
      return { icon: driveSpreadsheet, isInverted: false };
    }
    if (driveFile?.source === "document") {
      return { icon: driveDocs, isInverted: false };
    }
    if (driveFile?.source === "forms") {
      return { icon: driveForms, isInverted: false };
    }
    if (driveFile?.source === "jamboard") {
      return { icon: driveJamboard, isInverted: false };
    }
    return { icon: drive, isInverted: false };
  }
}

const log = makeLogger("Notification App Icon");

export const NotificationAppIcon = styledObserver(function NotificationAppIcon({
  notification,
  className,
  isOnDarkBackground = uiStore.isInDarkMode,
}: Props) {
  const targetNotification = notification.inner;

  const unknownNode = <UIUnknown className={className}>?</UIUnknown>;

  if (!targetNotification) {
    log.error(`unable to find inner notification for notification id ${notification.id}`);
    return unknownNode;
  }

  const iconProps = getIconSource(targetNotification, isOnDarkBackground);

  if (!iconProps) {
    log.error(`icon not defined for notification ${targetNotification.__typename}`);
    return unknownNode;
  }

  return (
    <UIHolder>
      <UIIcon
        className={[className, notification.inner?.__typename].join(" ")}
        src={iconProps.icon}
        $invert={iconProps.isInverted}
      />
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
