import fs from "fs";
import path from "path";

import { Parcel } from "@parcel/core";
import { $ } from "zx";

/**
 * Electron dev workflow is a bit complex.
 * This is single-entry-point initializing and handling entire dev workflow.
 *
 * Before you continue, strongly recommended read https://www.electronjs.org/docs/latest/tutorial/quick-start
 * (especially understanding what is main and renderer process)
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
  entries: path.resolve(ELECTRON_DIR, "index.ts"),
  defaultConfig: "@parcel/config-default",
  targets: {
    default: {
      // !Important - this code runs in node.js (not browser) env - we don't want to include node_modules in the bundle.
      includeNodeModules: false,
      distDir: path.resolve(__dirname, "dist/electron"),
      // It is never loaded remotely - we can disable all sort of optimizations of the bundle
      optimize: false,
    },
  },
});

// Client code bundler
const clientBundler = new Parcel({
  entries: path.resolve(CLIENT_DIR, "index.html"),
  defaultConfig: "@parcel/config-default",
  // Enable hot reloading and dev server on localhost
  serveOptions: {
    port: 3000,
  },
  hmrOptions: {
    port: 3000,
  },
  defaultTargetOptions: {
    distDir: path.resolve(__dirname, "dist/client"),
  },
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

function removeDirectory(dir: string) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true });
  }
}
