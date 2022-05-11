import { DebounceSettings, debounce } from "lodash";
import { Reaction } from "mobx";

import { MaybeCleanup } from "../types";

export function debouncedAutorunEffect(
  callback: () => MaybeCleanup,
  time: number,
  debounceSettings?: DebounceSettings
) {
  const reaction = new Reaction("debouncedAutorun", () => {
    scheduleRun();
  });

  let previousCleanup: MaybeCleanup;

  function cleanPrevious() {
    previousCleanup?.();
    previousCleanup = undefined;
  }

  const scheduleRun = debounce(
    () => {
      cleanPrevious();
      reaction.track(() => {
        previousCleanup = callback();
      });
    },
    time,
    debounceSettings
  );

  scheduleRun();

  return function stop() {
    reaction.dispose();
    cleanPrevious();
    scheduleRun.cancel();
  };
}
