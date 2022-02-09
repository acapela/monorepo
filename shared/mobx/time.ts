import { mapValues, memoize } from "lodash";
import { createAtom } from "mobx";

import { createLogger } from "@aca/shared/log";
import { createTimeout, timeDuration } from "@aca/shared/time";

/**
 * Ticks that will make react components re-render periodically in given interval.
 */

export const createMobxTick = memoize((interval: number) => {
  const tick = createAtom(`tick-${interval}`);

  setInterval(() => {
    tick.reportChanged();
  }, interval);

  return tick;
});

export const mobxTicks = mapValues(timeDuration, (duration) => {
  return createMobxTick(duration);
});

const log = createLogger("Mobx tick", false);

export const createMobxTickAtDateAtom = memoize(
  (date: Date) => {
    const now = Date.now();

    if (now >= date.getTime()) return null;

    const durationTillTick = date.getTime() - now;

    // Create mobx atom that will tick at given time
    const atom = createAtom(`Time tick`);

    log("Will schedule tick in", durationTillTick);

    // TODO: Should we ignore long-running ones (eg scheduled for next month?)

    createTimeout(() => {
      log("Tick fired");
      atom.reportChanged();
    }, durationTillTick);

    return atom;
  },
  // Let's reuse ticks that point to the same time
  (date) => date.getTime()
);

export const mobxTickAt = (date: Date) => {
  const atom = createMobxTickAtDateAtom(date);
  atom?.reportObserved();
};
