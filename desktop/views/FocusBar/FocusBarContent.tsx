import { observer } from "mobx-react";
import React, { useEffect } from "react";
import styled from "styled-components";

import { openNotificationInApp } from "@aca/desktop/actions/notification";
import { getPrimaryNotification } from "@aca/desktop/domains/group/group";
import { runActionWith } from "@aca/desktop/domains/runAction";
import { FocusSession } from "@aca/desktop/store/focus";
import { getFadeInAnimationStyles } from "@aca/ui/animations";
import { theme } from "@aca/ui/theme";

import { FocusBarActiveItemActions } from "./ActiveItemActions";
import { FocusBarActiveItemInfo } from "./ActiveItemInfo";
import { FocusBarNavigation } from "./Navigation";
import { FocusBarTools } from "./Tools";

interface Props {
  session: FocusSession;
}

export const FocusBarContent = observer(({ session }: Props) => {
  useEffect(() => {
    if (!session.activeNotification) return;

    runActionWith(openNotificationInApp, getPrimaryNotification(session.activeNotification));
  }, [session.activeNotification]);

  return (
    <UIHolder>
      <FocusBarTools session={session} />
      <FocusBarNavigation session={session} />

      <FocusBarActiveItemInfo item={session.activeNotification} />
      <FocusBarActiveItemActions notification={session.activeNotification} />
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  border-radius: 12px;
  align-items: center;
  padding: 0 12px;
  gap: 8px;
  min-width: 960px;
  min-height: 68px;
  ${theme.common.dragWindow};

  ${theme.transitions.hover()}

  &:hover {
    border-color: ${theme.colors.primary.opacity(0.5).value};
  }

  ${getFadeInAnimationStyles(0.2)};
`;
