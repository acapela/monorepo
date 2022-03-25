import { Cleanup, MaybeCleanup } from "./types";

export interface Effect<A extends unknown[]> {
  clean: Cleanup;
  run(...args: A): Cleanup;
}

export function createEffect<A extends unknown[]>(callback: (...args: A) => MaybeCleanup): Effect<A> {
  let currentCleanup: MaybeCleanup;

  function clean() {
    if (currentCleanup) {
      currentCleanup();
      currentCleanup = undefined;
    }
  }

  function run(...args: A) {
    clean();

    const cleanup = callback(...args);

    currentCleanup = cleanup;

    return () => {
      cleanup?.();
    };
  }

  return { run, clean };
}
