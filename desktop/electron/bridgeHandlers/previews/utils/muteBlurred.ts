import { BrowserView } from "electron";

import { listenToWebContentsFocus } from "@aca/desktop/electron/utils/webContentsLink";

export function autoMuteBlurredBrowserView(browserView: BrowserView) {
  browserView.webContents.setAudioMuted(true);
  return listenToWebContentsFocus(browserView.webContents, (isFocused) => {
    browserView.webContents.setAudioMuted(!isFocused);
  });
}
