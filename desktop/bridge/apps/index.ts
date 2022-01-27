import { createInvokeBridge } from "../base/channels";

/*
  The render thread has to load up quite a few things before it is ready to take in
  worker requests, e.g. user session + client db.
  This bridge is used by the render thread to signal that all electron thread workers
  can start syncing.
*/
export const workerSyncStart = createInvokeBridge<void, boolean>("worker-sync-ready");
