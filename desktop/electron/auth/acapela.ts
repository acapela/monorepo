import { BrowserWindow, session } from "electron";

import { authTokenBridgeValue, loginBridge } from "@aca/desktop/bridge/auth";

import { syncGoogleAuthState } from "./google";
import { syncSlackAuthState } from "./slack";
import { authWindowDefaultOptions } from "./utils";

async function getAcapelaAuthToken() {
  const cookies = await session.defaultSession.cookies.get({ name: "next-auth.session-token" });

  const [cookie] = cookies;

  if (!cookie) return null;

  return cookie.value;
}

export async function loginAcapela() {
  const currentToken = await getAcapelaAuthToken();
  if (currentToken) {
    authTokenBridgeValue.set(currentToken);
    console.info("Already logged in");
    return;
  }

  const window = new BrowserWindow({ ...authWindowDefaultOptions });

  window.webContents.loadURL(`http://localhost:3000/app/login`);

  window.webContents.on("did-navigate-in-page", async () => {
    const token = await getAcapelaAuthToken();

    if (!token) {
      return;
    }

    window.close();

    authTokenBridgeValue.set(token);

    /**
     * We don't know what kind of auth method user has chosen.
     *
     * But a side-effect is that user is already logged in in one of those.
     *
     * eg. if you sign to acapela with Google, you'll already by logged in Google when it's done.
     *
     * Thus lets re-check auth status so it is up-to-date and synced with frontend
     *
     * TODO: Maybe there is some 'cookie change' listener so we could avoid such imperative code.
     */
    await Promise.all([syncGoogleAuthState(), syncSlackAuthState()]);
  });
}

export function initializeLoginHandler() {
  loginBridge.handle(async () => {
    await loginAcapela();
  });

  getAcapelaAuthToken().then((token) => {
    authTokenBridgeValue.set(token);
  });
}
