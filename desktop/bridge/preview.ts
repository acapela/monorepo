import { createInvokeBridge } from "./base/channels";

type Data = { url: string; id: string };

export const registerBrowserViewPreload = createInvokeBridge<Boolean, Data>("register-browser-view-preload");
export const unregisterBrowserViewPreload = createInvokeBridge<Boolean, Data>("unregister-browser-view-preload");

export const showBrowserView = createInvokeBridge<Boolean, Data & { bounds: Electron.Rectangle }>("show-browser-view");
export const hideBrowserView = createInvokeBridge<Boolean, Data>("hide-browser-view");
