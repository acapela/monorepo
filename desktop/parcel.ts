import fs from "fs";
import path from "path";

import { Parcel } from "@parcel/core";

const ELECTRON_DIR = path.resolve(__dirname, "electron");
const CLIENT_DIR = path.resolve(__dirname, "client");

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // Let's extend ProcessEnv to provide process.env autocompletion
    export interface ProcessEnv {
      // It is possible to narrow down types of some env variables here.
      ELECTRON_CONTEXT: "client" | "electron";
    }
  }
}

/**
 * There are 2 javascript 'entry' points
 * - one for 'main' process (called 'electron' to avoid confusion) - javascript ran to bootstrap and manage electron app
 * - one is for 'client' (javascript ran inside 'browser' of electron)
 */

// Electron code bundler
export function createElectronBundler(isProd: boolean): Parcel {
  return new Parcel({
    // point into entry of electron code
    entries: [path.resolve(ELECTRON_DIR, "index.ts"), path.resolve(ELECTRON_DIR, "preload.ts")],
    defaultConfig: "@parcel/config-default",
    mode: isProd ? "production" : "development",
    targets: {
      default: {
        distDir: path.resolve(__dirname, "dist/electron"),
        // It is never loaded remotely - we can disable all sort of optimizations of the bundle
        optimize: false,
        context: "electron-main",
        includeNodeModules: isProd || ["@aca/shared", "@aca/ui", "@aca/config", "@aca/db", "@aca/gql", "@aca/desktop"],
      },
    },
    env: {
      ELECTRON_CONTEXT: "electron",
    } as NodeJS.ProcessEnv,
  });
}

export function createClientBundler(isProd: boolean): Parcel {
  const distDir = path.resolve(__dirname, "dist/client");
  return new Parcel({
    entries: path.resolve(CLIENT_DIR, "index.html"),
    defaultConfig: "@parcel/config-default",
    mode: isProd ? "production" : "development",
    defaultTargetOptions: {
      distDir,
    },
    targets: {
      default: {
        publicUrl: "./",
        includeNodeModules: true,
        distDir,
        context: "browser",
        scopeHoist: true,
        outputFormat: "commonjs",
        optimize: true,
      },
    },
    env: {
      ELECTRON_CONTEXT: "client",
    } as NodeJS.ProcessEnv,
    ...(isProd
      ? {}
      : {
          serveOptions: {
            port: 3005,
          },
          hmrOptions: {
            port: 3005,
          },
        }),
  });
}

export function removeDirectory(dir: string) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true });
  }
}
