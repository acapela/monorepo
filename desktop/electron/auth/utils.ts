import { BrowserWindowConstructorOptions } from "electron";

export const authWindowDefaultOptions: BrowserWindowConstructorOptions = {
  width: 600,
  height: 700,
};

export const RETRY_TIMES = 30;
export const RETRY_DELAY_MS = 500;
