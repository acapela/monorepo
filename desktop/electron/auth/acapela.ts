import { BrowserWindow, session } from "electron";

import { authTokenBridgeValue, loginBridge } from "@aca/desktop/bridge/auth";
import { FRONTEND_URL } from "@aca/desktop/lib/env";

import { syncGoogleAuthState } from "./google";
import { authWindowDefaultOptions } from "./utils";

export async function getAcapelaAuthToken() {
  const [cookie] = await session.defaultSession.cookies.get({ name: "next-auth.session-token" });
  if (!cookie) return null;

  // Set another cookie with weakened sameSite policy to allow us to make requests from our app which is on a different
  // domain, namely localhost in development and file:// in production.
  await session.defaultSession.cookies.set({
    url: "https://" + cookie.domain,
    domain: cookie.domain,
    name: cookie.name,
    value: cookie.value,
    sameSite: "no_restriction",
    secure: true,
    httpOnly: true,
    expirationDate: cookie.expirationDate,
  });

  return cookie.value;
}

export async function loginAcapela(provider: "slack" | "google") {
  const currentToken = await getAcapelaAuthToken();
  if (currentToken) {
    authTokenBridgeValue.set(currentToken);
    console.info("Already logged in");
    return;
  }

  const window = new BrowserWindow({ ...authWindowDefaultOptions });

  window.webContents.loadURL(FRONTEND_URL + `/app/login?provider=${provider}`);

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
    await syncGoogleAuthState();
  });
}

export function initializeLoginHandler() {
  loginBridge.handle(async (loginProvider) => {
    await loginAcapela(loginProvider);
  });

  getAcapelaAuthToken().then((token) => {
    authTokenBridgeValue.set(token);
  });
}
