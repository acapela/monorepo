import { AnimatePresence } from "framer-motion";
import { entries } from "lodash";
import React, { ReactNode, forwardRef, useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import styled, { StyleSheetManager, createGlobalStyle } from "styled-components";

import { AppStyleProvider } from "@aca/desktop/client/AppStyleProvider";
import { WindowContext } from "@aca/shared/context/window";
import { useSharedRef } from "@aca/shared/hooks/useSharedRef";
import { PresenceAnimator } from "@aca/ui/PresenceAnimator";

import { ChildWindowCustomKind } from "../childWindow/kinds";

// prettier-ignore
type VibrancyStyle = "appearance-based"| "light"| "dark"| "titlebar"| "selection"| "menu"| "popover"| "sidebar"| "medium-light"| "ultra-dark"| "header"| "sheet"| "window"| "hud"| "fullscreen-ui"| "tooltip"| "content"| "under-window"| "under-page";

interface WindowInitialOptions {
  center?: boolean;
  left?: number;
  top?: number;
  frame?: boolean;
  width?: number;
  height?: number;
  transparent?: boolean;
  resizable?: boolean;
  hasShadow?: boolean;
  fullscreenable?: boolean;
  thickFrame?: boolean;
  vibrancy?: VibrancyStyle;
}

interface Props {
  children: ReactNode;
  options?: WindowInitialOptions;
  kind?: ChildWindowCustomKind;
  /**
   * This prop is required! We cannot prevent user from closing the window, yet we want react-state to reflect
   * that window is closed and stop rendering.
   *
   * TODO: We should warn if component is still rendered after this callback is called
   */
  onClosed: () => void;
}

/**
 * Electron expect options in format like: 'top=500,left=200,frame=false,nodeIntegration=no'
 *
 * https://www.electronjs.org/docs/latest/api/window-open
 */
function prepareFeaturesString(options: WindowInitialOptions, kind?: ChildWindowCustomKind) {
  const featuresList = entries(options).map(([key, value]) => {
    return `${key}=${value}`;
  });

  if (kind) {
    featuresList.push(`kind=${kind}`);
  }

  return featuresList.join(",");
}

/**
 * React version of creating new browser window.
 * Simply do <NewBrowserWindow>Foo</NewBrowserWindow> and Foo will be rendered in a new window
 */
export const NewBrowserWindow = forwardRef<Window, Props>(function NewBrowserWindow(
  { children, options = {}, onClosed, kind }: Props,
  ref
) {
  const [newWindow, setNewWindowBody] = useState<Window | null>(null);
  const [isClosed, setIsClosed] = useState(false);

  const features = prepareFeaturesString(options, kind);

  const innerRef = useSharedRef<Window | null>(null, [ref]);

  // Share ref of window
  useLayoutEffect(() => {
    innerRef.current = newWindow;
  }, [newWindow]);

  useEffect(() => {
    const newWindow = window.open("about:blank", "_blank", features);

    if (!newWindow) {
      console.warn("Failed to create new window");
      return;
    }

    newWindow.addEventListener("load", () => {
      setNewWindowBody(newWindow);
    });

    newWindow.addEventListener("unload", () => {
      setIsClosed(true);
      setNewWindowBody(null);
      onClosed();
    });

    setNewWindowBody(newWindow);

    return () => {
      newWindow.close();
    };
  }, []);

  if (!newWindow || isClosed) return null;

  /**
   * ! We're rendering via portal to other window!
   */
  return createPortal(
    /**
     * This is important!
     *
     * We need to create independent stylesheet manager here as CSS is not shared between windows.
     *
     * Everything rendered inside this StyleSheetManager will create <style> tags inside new window <head>
     */
    <StyleSheetManager target={newWindow.document.body}>
      <AppStyleProvider>
        {/* We want to keep element alive for a moment in case window is closed with animation */}
        <AnimatePresence>
          <KeepAlive presenceStyles={{ opacity: [1, 1] }} transition={{ duration: 0.5 }}>
            {/* We wrap new 'window' context. This is important for all hooks like 'useShortcut', or 'useWindowEvent' to read from it to attach events to correct window */}
            <WindowContext value={newWindow}>
              <WindowStyles />
              {children}
            </WindowContext>
          </KeepAlive>
        </AnimatePresence>
      </AppStyleProvider>
    </StyleSheetManager>,
    newWindow.document.body
  );
});

const WindowStyles = createGlobalStyle`
  /* This is important in case we want electron to render transparent window */
  body {background: transparent}
`;

// Window might be closed with animation - we want to keep react component alive for a moment because of that.
const KeepAlive = styled(PresenceAnimator)``;
