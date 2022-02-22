import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { showMainWindowRequest } from "@aca/desktop/bridge/system";
import { NewBrowserWindow } from "@aca/desktop/domains/window/NewBrowserWindow";
import { desktopRouter } from "@aca/desktop/routes";
import { uiStore } from "@aca/desktop/store/ui";
import { useDocumentEvent, useWindowEvent } from "@aca/shared/domEvents";
import { PopPresenceAnimator } from "@aca/ui/animations";
import { theme } from "@aca/ui/theme";

import { Lists } from "./Lists";

function Events() {
  useWindowEvent("blur", () => {
    uiStore.isShowingPeekView = false;
  });

  useDocumentEvent(
    "keyup",
    () => {
      uiStore.isShowingPeekView = false;
    },
    { capture: true }
  );

  useDocumentEvent("keydown", (event) => {
    if (event.key === "Enter") {
      showMainWindowRequest();
      uiStore.isShowingPeekView = false;
      desktopRouter.navigate("home");
    }
  });

  return null;
}

export const PeekView = observer(() => {
  if (!uiStore.isShowingPeekView) return null;

  return (
    <NewBrowserWindow
      onClosed={() => {
        uiStore.isShowingPeekView = false;
      }}
      options={{
        width: 300,
        height: 110,
        frame: false,
        transparent: true,
        resizable: false,
        hasShadow: false,
        vibrancy: "tooltip",
      }}
    >
      <Events />
      <UIHolder>
        <Lists />
      </UIHolder>
    </NewBrowserWindow>
  );
});

const UIHolder = styled(PopPresenceAnimator)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  color: #fff;
  padding: 5px 20px;
  ${theme.common.dragWindow}
  ${theme.radius.panel}
`;
