import path from "path";

import IS_DEV from "electron-is-dev";

// Note - please always use 'path' module for paths (especially with slashes) instead of eg `${pathA}/${pathB}` to avoid breaking it on windows.
// Note - do not use relative paths without __dirname
const DIST_PATH = path.resolve(__dirname, "../client");
export const PRELOAD_SCRIPT_PATH = path.resolve(__dirname, "preload.js");

export type KnownEntryFile = "index.html" | "overlay.html";

export function getEntryHTMLFilePath(htmlFileName: KnownEntryFile) {
  if (IS_DEV) {
    return `http://localhost:3005/${htmlFileName}`;
  }

  return `file://${path.resolve(DIST_PATH, htmlFileName)}`;
}
