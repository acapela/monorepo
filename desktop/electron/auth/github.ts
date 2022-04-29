import { BrowserWindow, session } from "electron";

import { githubAuthTokenBridgeValue, loginGitHubBridge } from "@aca/desktop/bridge/auth";
import { addToast } from "@aca/desktop/domains/toasts/store";
import { FRONTEND_URL } from "@aca/desktop/lib/env";

import { RETRY_DELAY_MS, RETRY_TIMES, authWindowDefaultOptions } from "./utils";

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
        const callbackError = url.searchParams.get("error");
        if (callbackError === "install_requested") {
          addToast({
            title: "Insufficient permissions",
            message: "Permissions were requested. Try again once granted.",
            durationMs: 10 * 1000,
          });
        }

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

  for (let i = 0; i < RETRY_TIMES; i++) {
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
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
