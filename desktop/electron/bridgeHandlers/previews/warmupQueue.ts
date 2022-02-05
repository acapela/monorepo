import { removeElementFromArray } from "@aca/shared/array";
import { assert, unsafeAssert } from "@aca/shared/assert";
import { createChannel } from "@aca/shared/channel";
import { createTimeout } from "@aca/shared/time";
import { Cleanup } from "@aca/shared/types";

interface WarmupQueueConfig<T> {
  maxItems: number;
  initialize: (item: T) => void;
  cleanup: (item: T) => void;
  timeout: number;
}

interface WarmupRequestSession<T> {
  item: T;
}

export function warmupQueue<T>({ maxItems, initialize, cleanup, timeout }: WarmupQueueConfig<T>) {
  type Session = WarmupRequestSession<T>;
  const queueList = queueWithMaxSize<T>(maxItems);
  const requestSessions: Session[] = [];

  function isItemByAnySessionRequested(item: T) {
    return requestSessions.some((session) => session.item === item);
  }

  queueList.onAdded.subscribe((item) => {
    initialize(item);
  });

  queueList.onRemoved.subscribe((item) => {
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
    }, 10000);
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

  const urls = () => items.map((i) => i.url);

  function add(item: T) {
    const url = item.url;
    console.log("adding", url, urls(), { maxSize });
    if (items.includes(item)) {
      console.log("before", urls());
      arrayMoveItemToStart(items, item);
      console.log("item", url, "already present", urls());
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
    console.log(
      "removing",
      item.url,
      items.map((i) => i.url)
    );

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
