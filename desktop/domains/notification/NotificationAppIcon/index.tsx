import React from "react";
import styled, { css } from "styled-components";

import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { styledObserver } from "@aca/shared/component";

import figma from "./figma.svg";
import notion from "./notion.svg";
import slack from "./slack.svg";

interface Props {
  notification: NotificationEntity;
  className?: string;
}

export const NotificationAppIcon = styledObserver(function NotificationAppIcon({ notification, className }: Props) {
  const targetNotification = notification.inner;

  const unknownNode = <UIUnknown className={className}>?</UIUnknown>;

  if (!targetNotification) return unknownNode;

  if (targetNotification.__typename === "notification_slack_message") {
    return <UIIcon className={className} src={slack} />;
  }

  if (targetNotification.__typename === "notification_figma_comment") {
    return <UIIcon className={className} src={figma} />;
  }

  if (targetNotification.__typename === "notification_notion") {
    return <UIIcon className={className} src={notion} />;
  }

  return unknownNode;
})``;

const iconStyles = css`
  height: 1em;
  width: 1em;
`;

const UIIcon = styled.img`
  ${iconStyles}
`;

const UIUnknown = styled.div`
  ${iconStyles}
`;
