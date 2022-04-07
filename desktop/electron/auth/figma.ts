import { BrowserWindow, WebContents, session } from "electron";

import { clearServiceCookiesBridge, figmaAuthTokenBridgeValue, loginFigmaBridge } from "@aca/desktop/bridge/auth";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { addToast } from "@aca/desktop/domains/toasts/store";
import { tryInitializeServiceSync } from "@aca/desktop/electron/apps";
import { timeDuration } from "@aca/shared/time";

import { authWindowDefaultOptions } from "./utils";

export interface FigmaSessionData {
  cookie: string;
  figmaUserId: string;
  trackingSessionId: string;
}

export const figmaDomain = "www.figma.com";
export const figmaURL = `https://${figmaDomain}`;

const log = makeLogger("Figma-Auth");

export async function getFigmaAuthTokenFromCookies() {
  const cookies = await session.defaultSession.cookies.get({ url: figmaURL });

  const sessionCookie = cookies.find((cookie) => cookie.name === "figma.mst");

  if (!sessionCookie) return null;

  return sessionCookie.value;
}

export async function loginFigma() {
  const window = new BrowserWindow({ ...authWindowDefaultOptions });

  window.webContents.loadURL(figmaURL + "/login");

  /*
    This is done as some previous actions that trigger a figma login may steal focus
    I believe the right fix for this is have the login screens as modals, but this would require
    managing closing the modals https://github.com/electron/electron/issues/30232
  */
  window.webContents.on("did-finish-load", () => {
    window.focus();
  });

  return new Promise<void>((resolve) => {
    window.webContents.on("did-navigate-in-page", async () => {
      const token = await getFigmaAuthTokenFromCookies();

      if (!token) {
        return;
      }

      const figmaSessionData = await getFigmaSessionData(window.webContents);

      window.close();

      figmaAuthTokenBridgeValue.set(figmaSessionData);
      resolve();
    });
  });
}

async function getFigmaSessionData(figmaWebContents: WebContents): Promise<FigmaSessionData> {
  const figmaUserId = await figmaWebContents.executeJavaScript("window.INITIAL_OPTIONS.user_data.id");

  // This seems to be used for distributed tracing mechanisms (e.g. https://www.jaegertracing.io/)
  // Some apis don't work without this
  const trackingSessionId = await figmaWebContents.executeJavaScript("window.INITIAL_OPTIONS.tracking_session_id");

  const figmaCookies = await figmaWebContents.session.cookies.get({
    url: figmaURL,
  });

  const cookie = figmaCookies
    .filter((cookie) => cookie.domain?.includes("figma.com"))
    .map((cookie) => cookie.name + "=" + cookie.value)
    .join("; ");

  log.assert(figmaUserId, "Cant find figma user is");
  log.assert(trackingSessionId, "cant find tracking session id");
  log.assert(cookie, "cant find figma cookie");

  return {
    figmaUserId,
    cookie,
    trackingSessionId,
  };
}

export function initializeFigmaAuthHandler() {
  loginFigmaBridge.handle(async () => {
    await loginFigma();
    tryInitializeServiceSync("figma");
  });

  // TODO: Delete after most people have gotten this update ~June 2022
  // We changed the figmaAuthTokenBridgeValue with this update, so we want to reconnect
  // people that have a figma session
  // Timeout to make sure that bridges are ready
  setTimeout(async () => {
    if ((await getFigmaAuthTokenFromCookies()) && !figmaAuthTokenBridgeValue.get()) {
      addToast({
        title: "Figma Sync Stopped",
        message: "Please reconnect to restart sync",
        durationMs: 2 * timeDuration.day,
        action: {
          label: "Reconnect",
          callback: () => loginFigmaBridge(),
        },
      });
    }
  }, 2000);
}

export function clearFigmaSessionData() {
  figmaAuthTokenBridgeValue.reset();
  clearServiceCookiesBridge({ url: figmaURL });
}
