import { mapValues, memoize } from "lodash";
import { createAtom } from "mobx";

import { timeDuration } from "./time";

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
