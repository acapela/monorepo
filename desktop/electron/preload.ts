import { contextBridge } from "electron";

import { IS_DEV } from "@aca/shared/dev";

/**
 * This is what is published from electron api to browser.
 *
 * It is not possible to import anything from 'electron' directly in browser - it has to be published here.
 */
const publishedApi = {
  loadPreferences: async () => {
    //
    console.info(IS_DEV);
  },
  foo: () => 42,
};

export type ElectronPublishedAPI = typeof publishedApi;

declare global {
  interface Window {
    electronAPI: ElectronPublishedAPI;
  }
}

contextBridge.exposeInMainWorld("electronBridge", publishedApi);
