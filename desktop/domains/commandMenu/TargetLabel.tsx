import React from "react";
import styled from "styled-components";

import { styledObserver } from "@aca/shared/component";
import { theme } from "@aca/ui/theme";

import { getNotificationsGroupMeta } from "../group/group";
import { getNotificationMeta } from "../notification/meta";
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

    if (notification) return `Notification - ${getNotificationMeta(notification).title}`;

    const group = actionContext.getTarget("group");

    if (group) return `${getNotificationsGroupMeta(group).title}`;

    return null;
  }

  const label = getTargetLabel();

  if (!label) return null;

  return <UILabel className={className}>{label}</UILabel>;
})``;

const UILabel = styled.div`
  ${theme.box.panel.hint.padding.radius}
  ${theme.colors.layout.actionPanel.hover.asBg};
  ${theme.typo.note.semibold.nowrap};
  ${theme.common.ellipsisText}
`;
