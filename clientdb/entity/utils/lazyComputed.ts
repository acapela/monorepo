import { IComputedValueOptions, Reaction, observable, onBecomeObserved, onBecomeUnobserved, runInAction } from "mobx";

import { isDev } from "~shared/dev";

import { createBiddableTimeout } from "./biddableTimeout";

export type LazyComputed<T> = {
  get(): T;
  dispose(): void;
};

const SECOND = 1000;

const KEEP_ALIVE_TIME_AFTER_UNOBSERVED = 15 * SECOND;

/**
 * Normally we keep not used computed alive for KEEP_ALIVE_TIME_AFTER_UNOBSERVED time.
 *
 * Very often, however - we have 'cascade' of computed's one using another. One being disposed instantly causes other one
 * to not be observed. In such case we don't want to wait KEEP_ALIVE_TIME_AFTER_UNOBSERVED for each 'cascade' level.
 *
 * Thus we'll set this flag to true when disposing lazy computed to avoid waiting if other computed becomes unobserved during cascade.
 */
let isDisposalCascadeRunning = false;

/**
 * This is computed that connect advantages of both 'keepAlive' true and false of normal computed:
 *
 * - we keep cached version even if it is not observed
 * - we keep this lazy meaning value is never re-computed if not requested
 *
 * It provided 'dispose' method, but will also dispose itself automatically if not used for longer than KEEP_ALIVE_TIME_AFTER_UNOBSERVED
 */
export function lazyComputed<T>(
  getter: () => T,
  { name = "LazyComputed", equals }: IComputedValueOptions<T> = {}
): LazyComputed<T> {
  let latestValue: T;
  let needsRecomputing = true;
  let currentReaction: Reaction | null;

  const computedHook = observable.box({}, { deep: false });

  let observersCount = 0;

  onBecomeObserved(computedHook, () => {
    observersCount++;
  });

  onBecomeUnobserved(computedHook, () => {
    observersCount--;

    // It stopped being observed because consumer reaction is not running anymore - schedule disposal after 'keep alive' time.
    scheduleDisposal();

    // Other consumers are still observing
    if (observersCount) return;

    // It became unobserved as result of other lazyComputed disposing. We don't need to wait for 'keep alive' time
    if (isDisposalCascadeRunning) {
      // Use timeout to avoid max-call-stack in case of very long computed>computed dependencies chains
      setTimeout(dispose, 0);
      return;
    }
  });

  function informObserversAboutUpdate() {
    runInAction(() => {
      computedHook.set({});
    });
  }

  // Will initialize reaction to watch that dependencies changed or re-use previous reaction if the same computed used multiple times
  function getOrCreateReaction() {
    if (currentReaction) {
      return currentReaction;
    }

    currentReaction = new Reaction(name, () => {
      // Dependencies it is tracking got outdated.

      // Set flag so on next value request we'll do full re-compute
      needsRecomputing = true;
      // Make observers re-run
      informObserversAboutUpdate();
    });

    // New reaction - keep track of it to debug memory leaks
    aliveLazyReactions++;

    return currentReaction;
  }

  function dispose() {
    try {
      // If other computed values become unobserved as result of this one being disposed - let them know so they instantly dispose in cascade
      isDisposalCascadeRunning = true;

      // We cannot dispose if it is still observed - it would cause eg. ui to stop to react to updates. Note - this should never happen.
      if (observersCount) return;

      // It was already disposed
      if (!currentReaction) return;

      currentReaction.dispose();
      needsRecomputing = true;
      currentReaction = null;

      aliveLazyReactions--;
    } finally {
      isDisposalCascadeRunning = false;
    }
  }

  // This works like a 'bid' - after KEEP_ALIVE_TIME_AFTER_UNOBSERVED timeout since last time this is called - we'll dispose
  const scheduleDisposal = createBiddableTimeout(KEEP_ALIVE_TIME_AFTER_UNOBSERVED, dispose);

  const recomputeValueIfNeeded = () => {
    // No dependencies did change since we last computed.
    if (!needsRecomputing) return;

    let newValue: T;
    // We need to re-compute
    getOrCreateReaction().track(() => {
      // Assign new value so it can be reused. Also we're tracking getting it so reaction knows if dependencies got outdated
      newValue = getter();
    });

    // Inform value is up to date
    needsRecomputing = false;

    if (!equals) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      latestValue = newValue!;
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (equals(latestValue, newValue!)) {
      return;
    }
  };
  // r.schedule();
  return {
    dispose,
    get() {
      // This is final 'getter'

      // If value is outdated - recompute it now (on demand - in lazy way)
      recomputeValueIfNeeded();

      // We need to be able to force consumer of this value to re-run, thus we read from computed hook that we'll update if value gets outdated
      computedHook.get();
      return latestValue;
    },
  };
}

/**
 * Debug utils
 */

let aliveLazyReactions = 0;

// As those are not auto disposed by mobx - we need to be careful with memory leaks - aliveLazyReactions should always fall to 0 after a while if no more reactions are running
const DEBUG_MEMORY_LEAKS = true;

if (typeof document !== "undefined" && DEBUG_MEMORY_LEAKS && isDev()) {
  setInterval(() => {
    console.info("alive lazy reactions", aliveLazyReactions);
  }, 250);
}
