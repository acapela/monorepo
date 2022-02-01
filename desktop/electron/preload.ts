import "@aca/desktop/lib/env"; // import for side effects

import * as Sentry from "@sentry/electron/dist/renderer";
import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";

import { ElectronChannelSubscriber } from "@aca/desktop/bridge/base/channels";
import { AppEnvData } from "@aca/desktop/envData";

const appEnvJSON = process.argv.pop();
const appEnv: AppEnvData = JSON.parse(appEnvJSON as string);

if (!appEnv.isDev) {
  Sentry.init({
    dsn: appEnv.sentryDsn,
    release: appEnv.version,
  });
}

/**
 * This is what is published from electron api to browser.
 *
 * TLDR (aka. why?): Electron API is powerful and we don't want all of it to be directly available in the browser.
 *
 * Read: https://www.electronjs.org/docs/latest/tutorial/context-isolation
 *
 * Note: It is not possible to import anything from 'electron' directly in browser - it has to be published here.
 *
 * Note2: This file can grow large, we can be splitted.
 * It can be a good place to publish specific APIS like 'Clipboard' access, requesting (and checking) system calendar permissions, etc.
 *
 * We should be careful here, tho, especially if we're loading some arbitral javascript in the browser we do not control.
 * eg. if we publish filesystem API here without careful checks - it might potentially lead to serious security issues.
 */
const publishedApi = {
  invoke: async (key: string, data: unknown) => {
    // TODO (security): reject other channels than registered bridges
    return ipcRenderer.invoke(key, data);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribe: (channel: string, subscriber: ElectronChannelSubscriber<any>) => {
    // TODO (security): reject other channels than registered bridges
    function handler(event: IpcRendererEvent, data: unknown) {
      subscriber(data, {
        reply(data: unknown) {
          ipcRenderer.send(channel, data);
        },
      });
    }
    ipcRenderer.on(channel, handler);

    return function cancel() {
      ipcRenderer.off(channel, handler);
    };
  },
  send: (channel: string, data: unknown) => {
    // TODO (security): reject other channels than registered bridges
    ipcRenderer.send(channel, data);
  },
  env: appEnv,
};

export type ElectronPublishedAPI = typeof publishedApi;

declare global {
  interface Window {
    electronBridge: ElectronPublishedAPI;
  }
}

contextBridge.exposeInMainWorld("electronBridge", publishedApi);
