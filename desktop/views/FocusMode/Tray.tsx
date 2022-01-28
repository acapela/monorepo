import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { exitFocusMode, goToNextNotification, goToPreviousNotification } from "@aca/desktop/actions/focus";
import { ActionIconButton } from "@aca/desktop/ui/ActionIconButton";

export const FocusModeTray = observer(function ListViewTray() {
  return (
    <>
      <UIHolder>
        <ActionIconButton action={exitFocusMode} />
        <UILimiter />
        <ActionIconButton action={goToPreviousNotification} />
        <ActionIconButton action={goToNextNotification} />
      </UIHolder>
    </>
  );
});

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UILimiter = styled.div`
  height: 24px;
`;
