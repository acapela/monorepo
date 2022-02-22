import { WebContents, shell } from "electron";

function isProtocolBasedUrl(url: string) {
  return url.includes("://");
}

export function makeLinksOpenInDefaultBrowser(webContents: WebContents) {
  webContents.on("new-window", function (e, url) {
    if (!isProtocolBasedUrl(url)) return;

    e.preventDefault();
    shell.openExternal(url);
  });
}
