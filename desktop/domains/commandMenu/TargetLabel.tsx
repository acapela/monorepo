import React from "react";
import styled from "styled-components";

import { styledObserver } from "@aca/shared/component";
import { theme } from "@aca/ui/theme";

import { getNotificationTitle } from "../notification/title";
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

    return null;
  }

  const label = getTargetLabel();

  return <UILabel className={className}>{label}</UILabel>;
})``;

const UILabel = styled.div`
  ${theme.box.label}
  ${theme.colors.layout.actionPanel.hover.asBg};
  ${theme.radius.badge};
  ${theme.typo.label.semibold.nowrap};
  ${theme.common.ellipsisText}
`;
