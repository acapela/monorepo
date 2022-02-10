import { createInvokeBridge } from "@aca/desktop/bridge/base/invoke";
import { WorkerService } from "@aca/desktop/electron/apps/types";

/*
  The render thread has to load up quite a few things before it is ready to take in
  worker requests, e.g. user session + client db.
  This bridge is used by the render thread to signal that all electron thread workers
  can start syncing.
*/
export const workerSyncStart = createInvokeBridge<boolean>("worker-sync-ready");

/*
  In some cases we need the worker syncs to run on changes in some other threads.
*/
export const forceWorkerSyncRun = createInvokeBridge<WorkerService[]>("worker-sync-run");

/*
  We need to check is the `protocol` or `url scheme` is registered locally. This allows
  us to just open the app locally instead of going through the URL.
*/
export const getIsAppInstalledLocally = createInvokeBridge<string, boolean>("is-app-installed-locally");
