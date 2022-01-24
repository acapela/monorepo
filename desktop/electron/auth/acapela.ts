import { BrowserWindow, session } from "electron";

import { authTokenBridgeValue, loginBridge } from "@aca/desktop/bridge/auth";

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
