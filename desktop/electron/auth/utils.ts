import { BrowserWindowConstructorOptions } from "electron";

export const authWindowDefaultOptions: BrowserWindowConstructorOptions = {
  width: 600,
  height: 700,
};

export const RETRY_TIMES = 30;
export const RETRY_DELAY_MS = 500;
export const userAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.81 Safari/537.36";
