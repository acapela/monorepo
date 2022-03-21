import { WebContents, shell } from "electron";

function isProtocolBasedUrl(url: string) {
  return url.includes("://");
}

const isAttemptingToLogin = (url: string) => url.startsWith("https://accounts.google.com/o/oauth2/");

export function makeLinksOpenInDefaultBrowser(webContents: WebContents) {
  webContents.on("new-window", function (e, url) {
    if (!isProtocolBasedUrl(url)) return;

    // Fixes case were Linear opens new window for Google login
    // We should keep this session within out electron app
    if (isAttemptingToLogin(url)) {
      return;
    }

    e.preventDefault();
    shell.openExternal(url);
  });
}
