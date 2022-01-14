import fs from "fs";
import path from "path";

import { Parcel } from "@parcel/core";

const ELECTRON_DIR = path.resolve(__dirname, "electron");
const CLIENT_DIR = path.resolve(__dirname, "client");

// Let's create 2 independent bundlers

// Electron code bundler
const electronBundler = new Parcel({
  // point into entry of electron code
  entries: [path.resolve(ELECTRON_DIR, "index.ts"), path.resolve(ELECTRON_DIR, "preload.ts")],
  defaultConfig: "@parcel/config-default",
  mode: "production",
  targets: {
    default: {
      distDir: path.resolve(__dirname, "dist/electron"),
      // It is never loaded remotely - we can disable all sort of optimizations of the bundle
      optimize: false,
      context: "electron-main",
      // TODO compute this list
      includeNodeModules: ["@aca/shared", "@aca/ui", "@aca/config", "@aca/db", "@aca/gql", "@aca/desktop"],
    },
  },
  env: {
    ELECTRON_CONTEXT: "electron",
  } as NodeJS.ProcessEnv,
});

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

// Client code bundler
const clientBundler = new Parcel({
  entries: path.resolve(CLIENT_DIR, "index.html"),
  defaultConfig: "@parcel/config-default",
  // Enable hot reloading and dev server on localhost
  mode: "production",
  serveOptions: {
    port: 3005,
  },
  hmrOptions: {
    port: 3005,
  },
  defaultTargetOptions: {
    distDir: path.resolve(__dirname, "dist/client"),
  },
  targets: {
    default: {
      includeNodeModules: true,
      distDir: path.resolve(__dirname, "dist/client"),
      context: "browser",
      scopeHoist: true,
      outputFormat: "commonjs",
      optimize: true,
    },
  },
  env: {
    ELECTRON_CONTEXT: "client",
  } as NodeJS.ProcessEnv,
});

async function build(name: string, bundler: Parcel) {
  console.info(`[${name}] starting build... 👷‍️🏗 `);
  try {
    const { bundleGraph, buildTime } = await bundler.run();
    console.info(`[${name}] built ${bundleGraph.getBundles().length} bundles in ${buildTime}ms! ✨`);
  } catch (e) {
    console.error(e);
  }
}

async function start() {
  console.info(`Building desktop app...`);
  // Let's remove previous files in dist to avoid gradually polluting it (files are hashed)
  removeDirectory(path.resolve(__dirname, "dist"));

  // Start client and electron bundler
  await Promise.all([build("client", clientBundler), build("electron", electronBundler)]);
}

start();

function removeDirectory(dir: string) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true });
  }
}
