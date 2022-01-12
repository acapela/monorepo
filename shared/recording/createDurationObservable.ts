import { action, makeAutoObservable } from "mobx";

import { createInterval } from "@aca/shared/time";

export function createDurationObservable() {
  const observableDuration = makeAutoObservable({ duration: 0 });

  const clear = createInterval(
    action(() => {
      observableDuration.duration++;
    }),
    1000
  );

  return {
    get time() {
      return observableDuration.duration;
    },
    clear,
  };
}
