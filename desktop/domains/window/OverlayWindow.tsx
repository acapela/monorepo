import { GlobalDesktopStyles } from "@aca/desktop/styles/GlobalDesktopStyles";
import { WindowContext } from "@aca/shared/context/window";
import { useSharedRef } from "@aca/shared/hooks/useSharedRef";
import { memoize } from "lodash";
import React, { ReactNode, forwardRef, useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { StyleSheetManager, createGlobalStyle } from "styled-components";

interface Props {
  children: ReactNode;
}

const getOverlayWindow = memoize(() => {
  const newWindow = window.open("about:blank", "_blank", `overlay=true`);

  newWindow?.document.write(defaultHtml);

  return newWindow;
});

const defaultHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
</body>
</html>
`.trim();

/**
 * React version of creating new browser window.
 * Simply do <NewBrowserWindow>Foo</NewBrowserWindow> and Foo will be rendered in a new window
 */
export const OverlayWindow = forwardRef<Window, Props>(function OverlayWindow({ children }: Props, ref) {
  const [targetWindow, setTargetWindow] = useState<Window | null>(null);

  const innerRef = useSharedRef<Window | null>(null, [ref]);

  // Share ref of window
  useLayoutEffect(() => {
    innerRef.current = targetWindow;
  }, [targetWindow]);

  useEffect(() => {
    const overlayWindow = getOverlayWindow();

    console.log({ overlayWindow });

    setTargetWindow(overlayWindow);
  }, []);

  if (!targetWindow) return null;

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
    <StyleSheetManager target={targetWindow.document.body}>
      <>
        {/* We wrap new 'window' context. This is important for all hooks like 'useShortcut', or 'useWindowEvent' to read from it to attach events to correct window */}
        <WindowContext value={targetWindow}>
          <WindowStyles />
          {/* We need to re-initialize all the root-styles */}
          {/* <GlobalDesktopStyles /> */}
          {children}
        </WindowContext>
      </>
    </StyleSheetManager>,
    targetWindow.document.body
  );
});

const WindowStyles = createGlobalStyle`
  /* This is important in case we want electron to render transparent window */
  body {background: transparent}

  html,body {

  margin: 0px;

  padding: 0px;

  pointer-events: none;
  -webkit-user-select: auto;
-webkit-app-region: no-drag;

  }
  
`;
