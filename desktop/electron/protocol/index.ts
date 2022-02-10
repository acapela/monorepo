import { app, shell } from "electron";
import Protocol from "protocol-registry";

import { openAppUrl } from "@aca/desktop/bridge/apps";
import { authTokenBridgeValue } from "@aca/desktop/bridge/auth";
import { handleUrlWithPattern } from "@aca/shared/urlPattern";

export const APP_PROTOCOL = "acapela";
const APP_PROTOCOL_PREFIX = `${APP_PROTOCOL}://`;

function handleAppReceivedUrl(url: string) {
  // should never happen - app handled different protocol than one we register here (is it even possible?)
  if (!url.startsWith(APP_PROTOCOL_PREFIX)) return;

  // acapela://foo/bar > foo/bar
  const path = url.replace(APP_PROTOCOL_PREFIX, "");

  // Handle auth token received
  handleUrlWithPattern("authorize/:token", path, ({ token }) => {
    authTokenBridgeValue.set(token);
  });
}

export function initializeProtocolHandlers() {
  // Register app as capable of handling acapela:// protocol
  app.setAsDefaultProtocolClient(APP_PROTOCOL);

  // TODO: Handle windows
  // TODO: In production build we'll need Info.plist protocol declaration.
  app.on("open-url", (event, url) => {
    handleAppReceivedUrl(url);
  });

  openAppUrl.handle(async (appUrlProps) => {
    if (appUrlProps.protocol && appUrlProps.localUrl && (await Protocol.checkifExists(appUrlProps.protocol))) {
      shell.openExternal(appUrlProps.localUrl);
      return true;
    }

    shell.openExternal(appUrlProps.fallback);
    return false;
  });
}
