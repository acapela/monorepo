import { isSameHour, isSameMinute } from "date-fns";

import { removeElementFromArray } from "@aca/shared/array";
import { createLogger } from "@aca/shared/log";

interface AntiSpamConfig {
  perMinute: number;
  perHour: number;
}

const log = createLogger("Anti spam");

export function createAntiSpamGuard({ perMinute, perHour }: AntiSpamConfig) {
  const callDates: Date[] = [];

  function filterOutOutdatedCalls(date: Date) {
    callDates.forEach((calledDate) => {
      if (!isSameHour(calledDate, date)) {
        removeElementFromArray(callDates, calledDate);
      }
    });
  }

  function callGuarded<R>(callback: () => R): R | null {
    const now = new Date();

    if (shouldBlock(now)) {
      return null;
    }

    filterOutOutdatedCalls(now);

    callDates.push(now);

    return callback();
  }

  function shouldBlock(now = new Date()) {
    const callsInThisMinute = callDates.filter((calledDate) => isSameMinute(calledDate, now));
    const callsInThisHour = callDates.filter((calledDate) => isSameHour(calledDate, now));

    if (callsInThisMinute.length > perMinute) {
      log(`Ignoring call - ${callsInThisMinute.length} calls happened this minute`);
      return true;
    }

    if (callsInThisHour.length > perHour) {
      log(`Ignoring call - ${callsInThisHour.length} calls happened this hour`);
      return true;
    }

    return false;
  }

  callGuarded.shouldBlock = shouldBlock;

  return callGuarded;
}
