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

export function createMobxTickAtDateAtom(date: Date, callback?: () => void) {
  const now = Date.now();

  if (now >= date.getTime()) return null;

  const durationTillTick = date.getTime() - now + 1; // <-- let's add 1 to be sure it will not tick on equal time to requested date

  // Create mobx atom that will tick at given time
  const atom = createAtom(`Time tick`);

  log("Will schedule tick in", durationTillTick);

  createTimeout(() => {
    log("Tick fired");
    callback?.();
    atom.reportChanged();
  }, durationTillTick);

  return atom;
}

export function mobxTickAt(date: Date, callback?: () => void) {
  const atom = createMobxTickAtDateAtom(date, callback);
  atom?.reportObserved();
}
