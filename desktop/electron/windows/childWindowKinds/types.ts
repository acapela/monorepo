import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";

import { MaybeCleanup } from "@aca/shared/types";

export type ChildWindowHandler = {
  initializer?: (window: BrowserWindow, host: BrowserWindow) => MaybeCleanup;
  options?: BrowserWindowConstructorOptions;
};
