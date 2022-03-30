import { BrowserWindow, session } from "electron";

import { githubAuthTokenBridgeValue, loginGitHubBridge } from "@aca/desktop/bridge/auth";
import { FRONTEND_URL } from "@aca/desktop/lib/env";

import { authWindowDefaultOptions } from "./utils";

const userAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.81 Safari/537.36";

function checkIfDone(url: URL): boolean {
  return url.origin === FRONTEND_URL && url.pathname.endsWith("done");
}

export async function loginGitHub() {
  const window = new BrowserWindow({ ...authWindowDefaultOptions });

  await window.webContents.loadURL(FRONTEND_URL + "/api/backend/v1/github/auth", { userAgent });

  return new Promise<void>((resolve) => {
    function checkIfCallbackSuccessful() {
      if (window.isDestroyed()) return;
      const url = new URL(window.webContents.getURL());
      const ghMatch =
        url.origin === "https://github.com" &&
        /^\/(((organizations\/(.+)\/)?settings)|(apps\/.+))\/installations\/(\d+)$/.exec(url.pathname);
      if (ghMatch) {
        const organization = ghMatch[5] ? ":missing:permissions:" : ghMatch[4];
        const installationId = ghMatch[6];
        const query = organization ? `?org=${organization}` : "";
        window.webContents.loadURL(FRONTEND_URL + `/api/backend/v1/github/link/${installationId}${query}`, {
          userAgent,
        });
      }
      if (checkIfDone(url)) {
        githubAuthTokenBridgeValue.set(true);
        window.close();
        resolve();
        return;
      }
      setTimeout(checkIfCallbackSuccessful, 1000);
    }

    checkIfCallbackSuccessful();
  });
}

export async function logoutGitHub(installationId?: number) {
  const window = new BrowserWindow({
    opacity: 0,
    transparent: false,
    alwaysOnTop: true,
    focusable: false,
    width: 100,
    height: 100,
    x: 1,
    y: 1,
  });
  window.setIgnoreMouseEvents(true);

  await window.webContents.loadURL(
    `${FRONTEND_URL}/api/backend/v1/github/unlink${installationId ? "/" + installationId : ""}`,
    { userAgent }
  );

  for (let i = 0; i < 30; i++) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (window.isDestroyed()) return;
    const url = new URL(window.webContents.getURL());
    if (!checkIfDone(url)) continue;
    // if installationId is passed, don't clear cookies
    if (installationId) break;
    const serviceCookies = await session.defaultSession.cookies.get({ url: "https://github.com" });
    await Promise.all(
      serviceCookies.map((cookie) => session.defaultSession.cookies.remove("https://github.com", cookie.name))
    );
    await githubAuthTokenBridgeValue.set(false);
    break;
  }
  window.close();
}

export function initializeGitHubAuthHandler() {
  loginGitHubBridge.handle(async (input) => {
    if (input?.logout) return logoutGitHub(input?.installationId);
    return loginGitHub();
  });
}
