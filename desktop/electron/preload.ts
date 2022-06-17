import "@sentry/electron/preload";

import "@aca/desktop/lib/env"; // import for side effects

import { IpcRendererEvent, clipboard, contextBridge, ipcRenderer } from "electron";

import { ElectronChannelSubscriber } from "@aca/desktop/bridge/base/channels";
import { AppEnvData } from "@aca/desktop/envData";
import { serializeUntracked } from "@aca/shared/mobx/utils";

const appEnvJSON = process.argv.pop();
const appEnv: AppEnvData = JSON.parse(appEnvJSON as string);

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
    try {
      return await ipcRenderer.invoke(key, serializeUntracked(data));
    } catch (error) {
      console.error(`Failed to invoke ${key}`, data, error);
      throw error;
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribe: (channel: string, subscriber: ElectronChannelSubscriber<any>) => {
    // TODO (security): reject other channels than registered bridges
    function handler(event: IpcRendererEvent, data: unknown) {
      subscriber(data, {
        reply(data: unknown) {
          try {
            ipcRenderer.send(channel, serializeUntracked(data));
          } catch (error) {
            console.error(`Failed to reply on channel ${channel}`, data, error);
            throw error;
          }
        },
      });
    }
    ipcRenderer.on(channel, handler);

    return function cancel() {
      ipcRenderer.off(channel, handler);
    };
  },
  send: (channel: string, data: unknown) => {
    const sendableData = serializeUntracked(data);
    try {
      ipcRenderer.send(channel, sendableData);
      ipcRenderer.send("broadcast-request", { channel, data: sendableData });
    } catch (error) {
      console.error(`Failed to send message on channel ${channel}`, data, error);
      throw error;
    }

    // TODO (security): reject other channels than registered bridges
  },
  sendSync: (channel: string, data: unknown) => {
    const sendableData = serializeUntracked(data);
    try {
      ipcRenderer.sendSync(channel, sendableData);
      ipcRenderer.send("broadcast-request", { channel, data: sendableData });
    } catch (error) {
      console.error(`Failed to send message on channel ${channel}`, data, error);
      throw error;
    }
    // TODO (security): reject other channels than registered bridges
  },
  copyToClipboard: (thing: string) => {
    clipboard.write({ text: thing });
  },
  env: appEnv,
};

export type ElectronPublishedAPI = typeof publishedApi;

contextBridge.exposeInMainWorld("electronBridge", publishedApi);
