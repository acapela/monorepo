import { mapValues, memoize } from "lodash";
import { createAtom } from "mobx";

import { createTimeout, timeDuration } from "@aca/shared/time";

/**
 * Ticks that will make react components re-render periodically in given interval.
 */

const createTick = memoize((interval: number) => {
  const tick = createAtom(`tick-${interval}`);

  setInterval(() => {
    tick.reportChanged();
  }, interval);

  return tick;
});

export const mobxTicks = mapValues(timeDuration, (duration) => {
  return createTick(duration);
});

export const mobxTickAt = memoize(
  (date: Date) => {
    const now = Date.now();

    if (now >= date.getTime()) return () => void 0;

    const durationTillTick = date.getTime() - now;

    // Create mobx atom that will tick at given time
    const atom = createAtom(`Time tick`);

    // TODO: Should we ignore long-running ones (eg scheduled for next month?)

    return createTimeout(() => {
      atom.reportChanged();
    }, durationTillTick);
  },
  // Let's reuse ticks that point to the same time
  (date) => date.getTime()
);
