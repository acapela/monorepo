import { differenceInMilliseconds, isPast } from "date-fns";

import { waitForDoNotDisturbToFinish } from "@aca/desktop/bridge/system";
import { niceFormatDateTime } from "@aca/shared/dates/format";
import { createLogger } from "@aca/shared/log";
import { createResolvablePromise } from "@aca/shared/promises";
import { createTimeout } from "@aca/shared/time";

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

const log = createLogger("System notifications");

function _scheduleNotification(scheduledNotification: ScheduledNotification) {
  const { date, title, body, onClick } = scheduledNotification;
  const { promise, resolve } = createResolvablePromise<boolean>();

  log(`Scheduling: ${niceFormatDateTime(date)}`, { scheduledNotification });

  const cancelSchedule = createDateTimeout(async () => {
    await waitForDoNotDisturbToFinish();

    log(`Flushing: ${niceFormatDateTime(date)}`, { scheduledNotification });

    if (isCancelled) {
      log(`Flushing2: ${niceFormatDateTime(date)}`, { scheduledNotification });
      resolve(false);
      return;
    }
    log(`Flushin3: ${niceFormatDateTime(date)}`, { scheduledNotification });

    const notification = new Notification(title, { body: body, timestamp: date.getTime() });

    notification.addEventListener("click", () => onClick?.(notification));

    resolve(true);
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

export function getWouldBeSpammyNotification() {
  return antiSpamGuard.shouldBlock();
}

export function scheduleNotification(scheduledNotification: ScheduledNotification) {
  return antiSpamGuard(() => _scheduleNotification(scheduledNotification));
}
