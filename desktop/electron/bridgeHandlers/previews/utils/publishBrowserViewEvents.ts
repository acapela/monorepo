import { BrowserView } from "electron";

import { previewEventsBridge } from "@aca/desktop/bridge/preview";
import { listenToWebContentsFocus } from "@aca/desktop/electron/utils/webContentsLink";
import { createCleanupObject } from "@aca/shared/cleanup";

export function publishBrowserViewEvents(url: string, browserView: BrowserView) {
  const cleanup = createCleanupObject();

  cleanup.next = listenToWebContentsFocus(browserView.webContents, (isFocused) => {
    browserView.webContents.setAudioMuted(!isFocused);
    previewEventsBridge.send({ url, type: isFocused ? "focus" : "blur" });
  });

  function handleFailedLoad() {
    // it is expected if we destroy view before it loads
    if (browserView.webContents.isDestroyed()) return;
    previewEventsBridge.send({ type: "load-error", url });
  }

  browserView.webContents.on("did-fail-load", handleFailedLoad);

  cleanup.next = () => browserView.webContents.off("did-fail-load", handleFailedLoad);

  return cleanup.clean;
}
