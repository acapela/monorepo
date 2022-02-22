import { app, shell } from "electron";

import { openAppUrl } from "@aca/desktop/bridge/apps";
import { authTokenBridgeValue } from "@aca/desktop/bridge/auth";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { checkIfAppExists } from "@aca/desktop/electron/utils/checkIfAppExists";
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

const log = makeLogger("App-Openner");

export function initializeProtocolHandlers() {
  // Register app as capable of handling acapela:// protocol
  app.setAsDefaultProtocolClient(APP_PROTOCOL);

  // TODO: Handle windows
  // TODO: In production build we'll need Info.plist protocol declaration.
  app.on("open-url", (event, url) => {
    handleAppReceivedUrl(url);
  });

  openAppUrl.handle(async (appUrlProps) => {
    try {
      if (appUrlProps.protocol && appUrlProps.localUrl && (await checkIfAppExists(appUrlProps.protocol))) {
        shell.openExternal(appUrlProps.localUrl);
        return true;
      }
    } catch (e) {
      log.error(e as Error);
    }

    shell.openExternal(appUrlProps.fallback);
    return false;
  });
}
