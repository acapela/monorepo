import { sortBy, throttle } from "lodash";

import { removeElementFromArray } from "@aca/shared/array";
import { assert, unsafeAssert } from "@aca/shared/assert";
import { createChannel } from "@aca/shared/channel";
import { createTimeout } from "@aca/shared/time";
import { Cleanup } from "@aca/shared/types";

interface WarmupQueueConfig<T> {
  maxItems: number;
  initialize: (item: T) => void;
  cleanup: (item: T) => void;
  /**
   * If every requestors stop requesting some warmup - how long to wait before actually cleaning up
   * the item.
   */
  timeout: number;
  /**
   * Items are not initialized instantly. They wait a brief moment to see if more were added together
   * with them. If so, it will order them by priority and call init's in this order.
   */
  getPriority?: (item: T) => number;
}

interface WarmupRequestSession<T> {
  item: T;
}

/**
 * Goal of warmup queue to allow requesting given items to be 'warm' (aka preloaded).
 *
 * - it has max count of 'warmed' items
 * - each item is initialized / cleaned up on being added or pushed away from list
 * - each time item is requested it is added to start
 *   - if it was already present - it is moved to start
 * - each item can be requested several times. As long as some requester does not 'give up' - it
 * will not be removed (unless pushed away by other, newer items)
 */
export function warmupQueue<T>({ maxItems, initialize, cleanup, getPriority, timeout }: WarmupQueueConfig<T>) {
  type Session = WarmupRequestSession<T>;
  const queueList = queueWithMaxSize<T>(maxItems);
  const requestSessions: Session[] = [];

  function isItemByAnySessionRequested(item: T) {
    return requestSessions.some((session) => session.item === item);
  }

  const pendingInitializationItems = new Set<T>();

  const flushInitialize = throttle(
    () => {
      const itemsToFlus = Array.from(pendingInitializationItems);
      pendingInitializationItems.clear();

      const itemsSortedByPriority = sortBy(itemsToFlus, (item) => {
        return getPriority?.(item) ?? Number.MAX_SAFE_INTEGER;
      });

      itemsSortedByPriority.forEach((item) => {
        initialize(item);
      });
    },
    20,
    { leading: false, trailing: true }
  );

  queueList.onAdded.subscribe((item) => {
    pendingInitializationItems.add(item);
    flushInitialize();
    initialize(item);
  });

  queueList.onRemoved.subscribe((item) => {
    pendingInitializationItems.delete(item);
    cleanup(item);
  });

  const cleanupsMap = new Map<T, () => void>();

  function cancelCleanup(item: T) {
    const cancelExisting = cleanupsMap.get(item);

    if (cancelExisting) {
      cancelExisting();
      cleanupsMap.delete(item);
    }
  }

  function scheduleMaybeCleanup(item: T) {
    cancelCleanup(item);

    const cancelNew = createTimeout(() => {
      if (isItemByAnySessionRequested(item)) return;

      queueList.remove(item);
    }, timeout);
    //
    cleanupsMap.set(item, cancelNew);
  }

  function cancelSession(session: Session) {
    assert(requestSessions.includes(session), "Already cancelled or never present");

    removeElementFromArray(requestSessions, session);

    scheduleMaybeCleanup(session.item);
  }

  function request(item: T): Cleanup {
    cancelCleanup(item);
    const session: Session = { item };
    requestSessions.push(session);
    queueList.add(item);

    return () => {
      cancelSession(session);
    };
  }

  return { request };
}

function queueWithMaxSize<T>(maxSize: number) {
  const onAdded = createChannel<T>();
  const onRemoved = createChannel<T>();

  const items: T[] = [];

  function add(item: T) {
    if (items.includes(item)) {
      arrayMoveItemToStart(items, item);
      return;
    }

    items.unshift(item);

    onAdded.publish(item);

    if (items.length > maxSize) {
      const removedItem = items.pop();
      unsafeAssert(removedItem);
      onRemoved.publish(removedItem);
    }
  }

  function remove(item: T) {
    const didRemove = removeElementFromArray(items, item);

    if (didRemove) {
      //
      onRemoved.publish(item);
    }
  }

  return {
    add,
    remove,
    onAdded,
    onRemoved,
  };
}

function arrayMoveByIndex<T>(arr: T[], old_index: number, new_index: number) {
  if (new_index >= arr.length) {
    let k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined as unknown as T);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
}

function arrayMoveItemToStart<T>(arr: T[], item: T) {
  const itemIndex = arr.indexOf(item);

  if (itemIndex === -1) return false;

  arrayMoveByIndex(arr, itemIndex, 0);
}
