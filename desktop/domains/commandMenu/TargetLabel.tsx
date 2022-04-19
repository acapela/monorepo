import React from "react";
import styled from "styled-components";

import { getNotificationTitle } from "@aca/desktop/domains/notification/title";
import { styledObserver } from "@aca/shared/component";
import { theme } from "@aca/ui/theme";

import { CommandMenuSession } from "./session";

interface Props {
  session: CommandMenuSession;
  className?: string;
}

export const CommandMenuTargetLabel = styledObserver(function CommandMenuView({ session, className }: Props) {
  const { actionContext } = session;
  function getTargetLabel() {
    const list = actionContext.getTarget("list");

    if (list) return `List - ${list.name}`;

    const notification = actionContext.getTarget("notification");

    if (notification) return `Notification - ${getNotificationTitle(notification)}`;

    const group = actionContext.getTarget("group");

    if (group) return `${group.integrationTitle} - ${group.name}`;

    return null;
  }

  const label = getTargetLabel();

  if (!label) return null;

  return <UILabel className={className}>{label}</UILabel>;
})``;

const UILabel = styled.div`
  ${theme.box.panel.hint.padding.radius}
  ${theme.colors.layout.actionPanel.hover.asBg};
  ${theme.typo.label.semibold.nowrap};
  ${theme.common.ellipsisText}
`;
