import { app, session } from "electron";

import { authTokenBridgeValue } from "@aca/desktop/bridge/auth";

import { handleUrlWithPattern } from "./urlPattern";

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
    session.defaultSession.cookies.set({
      url: "http://localhost:3000",
      name: "next-auth.session-token",
      value: token,
      expirationDate: Date.now() + 1_000 /*sec*/ * 60 /*min*/ * 60 /*h*/ * 24 /*day*/ * 365 /*year*/ * 10 /*years*/,
    });
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
}
