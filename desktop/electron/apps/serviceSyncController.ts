import { differenceInMilliseconds } from "date-fns";
import { capitalize } from "lodash";

import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";

export type WorkerService = "notion" | "figma";

export interface ServiceSyncController {
  serviceName: WorkerService;
  onWindowFocus: () => void;
  onWindowBlur: () => void;
  forceSync: () => void;
}

const WINDOW_BLURRED_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes;
const WINDOW_FOCUSED_INTERVAL_MS = 90 * 1000; // 90 seconds;

/*
  Pulling logic for notion
  - Pull immediately on app start
  - Pull every WINDOW_BLURRED_INTERVAL if main window is blurred
  - Pull every WINDOW_FOCUSED_INTERVAL if main window is focused
  - Pull immediately when window focuses if more than WINDOW_FOCUSED_INTERVAL have passed before last pull
*/
export function makeServiceSyncController(serviceName: WorkerService, cb: () => Promise<void>) {
  function serviceSyncBuilder() {
    let currentInterval: NodeJS.Timer | null = null;
    let timeOfLastSync: Date | null = null;
    let isSyncing = false;

    const log = makeLogger(`${capitalize(serviceName)}-Worker`);

    async function runSync() {
      if (isSyncing) {
        return;
      }

      try {
        isSyncing = true;

        log.info("Capturing started");

        await cb();
        log.info("Capturing complete");
        timeOfLastSync = new Date();
      } catch (e: unknown) {
        log.error(e as Error);
      } finally {
        isSyncing = false;
      }
    }

    function restartPullInterval(timeInterval: number) {
      if (currentInterval) {
        clearInterval(currentInterval);
      }
      currentInterval = setInterval(runSync, timeInterval);
    }

    runSync();

    return {
      serviceName,
      onWindowFocus() {
        const now = new Date();
        const isLongTimeSinceLastFocus =
          !timeOfLastSync || differenceInMilliseconds(now, timeOfLastSync) > WINDOW_FOCUSED_INTERVAL_MS;

        if (isLongTimeSinceLastFocus) {
          runSync();
        }
        restartPullInterval(WINDOW_FOCUSED_INTERVAL_MS);
      },
      onWindowBlur() {
        restartPullInterval(WINDOW_BLURRED_INTERVAL_MS);
      },
      forceSync() {
        runSync();
      },
    };
  }
  return serviceSyncBuilder();
}