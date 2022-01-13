import fs from "fs";
import path from "path";

import { Parcel } from "@parcel/core";
import nodeCleanup from "node-cleanup";
import { $ } from "zx";

/**
 * Electron dev workflow is a bit complex.
 * This is single-entry-point initializing and handling entire dev workflow.
 *
 * Before you continue, strongly recommended read https://www.electronjs.org/docs/latest/tutorial/quick-start
 * (especially understanding what is main and renderer process)
 *
 * Nomenclature - we're using changed nomenclature from default Electron one (https://github.com/weareacapela/monorepo/pull/893#discussion_r781890805)
 * electron's main process = electron
 * electron's renderer process = client
 *
 * Overview:
 * - we bundle both 'electron' and 'client' code
 * - we watch for changes and re-bundle
 * - client code has dev server and fast-refresh server running
 *   - you can technically open localhost:3000 to open it at any point
 * - electron code does not have 'dev' server, but is also in dev (watch mode)
 *   - on each successfully compiled file change it'll restart electron
 */

/**
 * There are 2 javascript 'entry' points
 * - one for 'main' process (called 'electron' to avoid confusion) - javascript ran to bootstrap and manage electron app
 * - one is for 'client' (javascript ran inside 'browser' of electron)
 */
const ELECTRON_DIR = path.resolve(__dirname, "electron");
const CLIENT_DIR = path.resolve(__dirname, "client");

// Let's create 2 independent bundlers

// Electron code bundler
const electronBundler = new Parcel({
  // point into entry of electron code
  entries: [path.resolve(ELECTRON_DIR, "index.ts"), path.resolve(ELECTRON_DIR, "preload.ts")],
  defaultConfig: "@parcel/config-default",

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
      // !Important - this code runs in node.js (not browser) env - we don't want to include node_modules in the bundle.
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

async function start() {
  console.info(`Starting desktop dev mode...`);
  // Let's remove previous files in dist to avoid gradually polluting it (files are hashed)
  removeDirectory(path.resolve(__dirname, "dist"));

  // Start client bundler in dev (watch) mode
  clientBundler.watch((error, event) => {
    if (error) {
      console.info(error.name, error.message, error.stack);
      return;
    }

    if (!event) return;

    if (event.type === "buildFailure") {
      console.info(event.diagnostics);
      return;
    }

    console.info("Client code compiled successfully");
  });

  // Start electron bundler in dev mode and re-initialize electron on each code change
  electronBundler.watch((error, event) => {
    if (error) {
      console.info(error.name, error.message, error.stack);
      return;
    }

    // It will never happen - event is undefined on error (handled above) - done for type-safety
    if (!event) return;

    if (event.type === "buildFailure") {
      console.info(event.diagnostics);
    }

    // Either initial or file change build is successful - initialize or restart electron
    if (event.type === "buildSuccess") {
      startOrRestartElectron();
    }
  });
}

start();

// We need to keep track of currently running electron process so we can kill it on electron code changes
let currentElectronInstance: ReturnType<typeof $> | null = null;

async function startOrRestartElectron() {
  if (currentElectronInstance) {
    console.info(`Closing previous instance of Electron`);
    // Kill without error to avoid this entire file to exit
    await currentElectronInstance.kill();
    currentElectronInstance = null;
  }

  console.info(`Starting new electron instance in dev mode`);

  // Start new instance of electron running in dev mode
  currentElectronInstance = $`yarn electron dist/electron/index.js`;

  currentElectronInstance.catch((error) => {
    // We either ctrl+c or restarted due to file change.
    if (error?.exitCode === null) return;

    console.info("Electron process error", error);
  });
}

nodeCleanup(() => {
  if (currentElectronInstance) {
    currentElectronInstance.kill();
  }
});

function removeDirectory(dir: string) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true });
  }
}
