// TODO: add ".svg" types for CI to not complain
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import styled, { css } from "styled-components";

import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { uiStore } from "@aca/desktop/store/uiStore";
import { styledObserver } from "@aca/shared/component";

//@ts-ignore
import figma from "./figma.svg";
//@ts-ignore
import linear from "./linear.svg";
//@ts-ignore
import notion from "./notion.svg";
//@ts-ignore
import slack from "./slack.svg";

interface Props {
  notification: NotificationEntity;
  isOnDarkBackground?: boolean;
  className?: string;
}

export const NotificationAppIcon = styledObserver(function NotificationAppIcon({
  notification,
  className,
  isOnDarkBackground = uiStore.isInDarkMode,
}: Props) {
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
    return <UIIcon className={className} src={notion} $invert={isOnDarkBackground} />;
  }

  if (targetNotification.__typename === "notification_linear") {
    return <UIIcon className={className} src={linear} />;
  }

  return unknownNode;
})``;

const iconStyles = css`
  height: 1em;
  width: 1em;
`;

const UIIcon = styled.img<{ $invert?: boolean }>`
  ${iconStyles};

  ${(props) =>
    props.$invert &&
    css`
      filter: invert(1);
    `}
`;

const UIUnknown = styled.div`
  ${iconStyles}
`;
