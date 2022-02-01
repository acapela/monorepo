import path from "path";

import nodeCleanup from "node-cleanup";
import { $ } from "zx";

import { createResolvablePromise } from "@aca/shared/promises";

import { createClientBundler, createElectronBundler, removeDirectory } from "./parcel";

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

async function start() {
  console.info(`Starting desktop dev mode...`);
  // Let's remove previous files in dist to avoid gradually polluting it (files are hashed)
  removeDirectory(path.resolve(__dirname, "dist"));

  const clientBundler = createClientBundler("development");
  const electronBundler = createElectronBundler("development");

  const clientCodeReady = createResolvablePromise();

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

    clientCodeReady.resolve();

    console.info("Client code compiled successfully");
  });

  // Start electron bundler in dev mode and re-initialize electron on each code change
  electronBundler.watch(async (error, event) => {
    await clientCodeReady.promise;
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
