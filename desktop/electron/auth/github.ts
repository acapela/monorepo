import axios from "axios";
import { BrowserWindow, session } from "electron";

import { githubAuthTokenBridgeValue, loginGitHubBridge } from "@aca/desktop/bridge/auth";
import { addToast } from "@aca/desktop/domains/toasts/store";
import { getAcapelaAuthToken } from "@aca/desktop/electron/auth/acapela";
import { FRONTEND_URL } from "@aca/desktop/lib/env";

import { authWindowDefaultOptions, userAgent } from "./utils";

function checkIfDone(url: URL): boolean {
  return url.origin === FRONTEND_URL && url.pathname.endsWith("done");
}

export async function loginGitHub() {
  const window = new BrowserWindow({ ...authWindowDefaultOptions });

  await window.webContents.loadURL(FRONTEND_URL + "/api/backend/v1/github/auth", { userAgent });

  return new Promise<void>((resolve, reject) => {
    function checkIfCallbackSuccessful() {
      if (window.isDestroyed()) {
        reject(new Error("Window closed before authorized"));
        return;
      }
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
  const acapelaAuthToken = await getAcapelaAuthToken();
  await axios.get(`${FRONTEND_URL}/api/backend/v1/github/unlink${installationId ? "/" + installationId : ""}`, {
    headers: { Cookie: `next-auth.session-token=${acapelaAuthToken}` },
  });
  if (installationId) return; // don't sign out, we just have unlinked a installation

  const serviceCookies = await session.defaultSession.cookies.get({ url: "https://github.com" });
  await Promise.all(
    serviceCookies.map((cookie) => session.defaultSession.cookies.remove("https://github.com", cookie.name))
  );
  await githubAuthTokenBridgeValue.set(false);
}

export function initializeGitHubAuthHandler() {
  loginGitHubBridge.handle(async (input) => {
    if (input?.logout) return logoutGitHub(input?.installationId);
    return loginGitHub();
  });
}
