import { differenceInMilliseconds, isPast } from "date-fns";

import { waitForDoNotDisturbToFinish } from "@aca/desktop/bridge/system";
import { niceFormatDateTime } from "@aca/shared/dates/format";
import { createResolvablePromise } from "@aca/shared/promises";
import { createTimeout } from "@aca/shared/time";

import { makeLogger } from "../dev/makeLogger";
import { createAntiSpamGuard } from "./antiSpam";
import { ScheduledNotification } from "./types";

function createDateTimeout(callback: () => void, date: Date) {
  if (isPast(date)) {
    callback();
    return () => void 0;
  }

  const duration = differenceInMilliseconds(date, new Date());

  return createTimeout(callback, duration);
}

const log = makeLogger("System notifications");

function showNotification(scheduledNotification: ScheduledNotification) {
  const { title, body, date, onClick } = scheduledNotification;

  const didShow = antiSpamGuard(
    () => {
      const notification = new Notification(title, {
        body: body,
        timestamp: date.getTime(),
        requireInteraction: scheduledNotification.requireInteraction,
      });

      notification.addEventListener("click", () => onClick?.(notification));
      return true;
    },
    () => {
      log("Notification ignored due to frequency filter");
    }
  );

  if (didShow) {
    scheduledNotification.onShown?.();
  }

  return didShow ?? false;
}

export function scheduleNotification(scheduledNotification: ScheduledNotification) {
  const { date } = scheduledNotification;
  const { promise, resolve } = createResolvablePromise<boolean>();

  log(`🔔 Scheduling notification: ${niceFormatDateTime(date)}`, { scheduledNotification });

  const cancelSchedule = createDateTimeout(async () => {
    await waitForDoNotDisturbToFinish();

    log(`🔔 Flushing notification`, { scheduledNotification });

    if (isCancelled) {
      resolve(false);
      return;
    }

    const didShow = showNotification(scheduledNotification);

    resolve(didShow);
  }, date);

  let isCancelled = false;

  function cancel() {
    isCancelled = true;
    cancelSchedule();
    resolve(false);
  }

  return [promise, cancel] as const;
}

const antiSpamGuard = createAntiSpamGuard({ perMinute: 2, perHour: 5 });
