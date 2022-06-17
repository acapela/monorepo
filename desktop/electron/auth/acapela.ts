import axios from "axios";
import { BrowserWindow, session } from "electron";

import { authTokenBridgeValue, autoLoginBridge, canAutoLoginBridge, loginBridge } from "@aca/desktop/bridge/auth";
import { FRONTEND_URL } from "@aca/desktop/lib/env";
import { IS_CI, IS_DEV } from "@aca/shared/dev";

import { syncGoogleAuthState } from "./google";
import { authWindowDefaultOptions } from "./utils";

const NEXT_AUTH_COOKIE_KEY = "next-auth.session-token";

export async function getAcapelaAuthToken() {
  const [cookie] = await session.defaultSession.cookies.get({ name: NEXT_AUTH_COOKIE_KEY });
  if (!cookie) return null;

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

  return new Promise<void>((resolve, reject) => {
    window.once("closed", () => {
      reject(new Error("Window closed before authorized"));
    });
    window.webContents.on("did-navigate-in-page", async () => {
      const token = await getAcapelaAuthToken();

      if (!token) {
        return;
      }

      resolve();

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
  });
}

async function fetchTestUserJWT() {
  const response = await axios.get("http://localhost:3000/api/backend/e2e/test_user");
  const { jwt } = response.data;
  return jwt as string;
}

async function autoLoginAcapelaForEnd2EndTest() {
  const jwt = await fetchTestUserJWT();
  await session.defaultSession.cookies.set({ name: NEXT_AUTH_COOKIE_KEY, value: jwt, url: "http://localhost:3000" });
  await authTokenBridgeValue.set(jwt);
}

export function initializeLoginHandler() {
  loginBridge.handle(async (loginProvider) => {
    await loginAcapela(loginProvider);
  });

  canAutoLoginBridge.handle(async () => (IS_DEV || IS_CI) && !!(await fetchTestUserJWT()));
  autoLoginBridge.handle(async () => {
    await autoLoginAcapelaForEnd2EndTest();
  });

  getAcapelaAuthToken().then((token) => {
    authTokenBridgeValue.set(token);
  });
}
