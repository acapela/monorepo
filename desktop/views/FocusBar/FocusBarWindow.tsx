import { observer } from "mobx-react";
import React from "react";

import { NewBrowserWindow } from "@aca/desktop/domains/window/NewBrowserWindow";
import { FocusSession } from "@aca/desktop/store/focus";
import { uiStore } from "@aca/desktop/store/ui";

import { FocusBarContent } from "./FocusBarContent";

interface Props {
  session: FocusSession;
}

export const FocusBarWindow = observer(({ session }: Props) => {
  return (
    <NewBrowserWindow
      onClosed={() => {
        uiStore.isShowingPeekView = false;
      }}
      options={{
        frame: false,
        hasShadow: true,
        transparent: true,
        resizable: false,
        fullscreenable: false,
        height: 68,
        width: 960,
      }}
      kind="focus-bar"
    >
      <FocusBarContent session={session} />
    </NewBrowserWindow>
  );
});
