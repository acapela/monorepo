import { removeElementFromArray } from "@aca/shared/array";
import { createTimeout } from "@aca/shared/time";

interface MemoizeWithCleanupConfig<Args extends unknown[], I> {
  keyGetter: (...args: Args) => string;
  cleanup: (item: I, key: string) => void;
  destroyTimeout: number;
}

/**
 * We need to keep it as object instead of just 'key' string so we have session reference that is not primitive
 */
interface MemoizeSession {
  key: string;
}

/**
 * Similar to regular 'memoize', except memoized item is 'long-lived' and is kept alive as long
 * as all 'requesters' will not release their requests
 */
export function memoizeWithCleanup<Args extends unknown[], I>(
  getter: (...args: Args) => I,
  { cleanup, keyGetter, destroyTimeout }: MemoizeWithCleanupConfig<Args, I>
) {
  const aliveSessions: MemoizeSession[] = [];
  const aliveItemsMap = new Map<string, I>();
  const pendingCleanups = new Map<string, () => void>();

  function destroyItemByKey(key: string) {
    const aliveItemToClean = aliveItemsMap.get(key);

    if (aliveItemToClean === undefined) {
      console.error(`Corrupted state. Alive item should be present but is not for key ${key}`);
      return;
    }

    cleanup(aliveItemToClean, key);
    aliveItemsMap.delete(key);
  }

  function cancelPendingDestroy(key: string) {
    pendingCleanups.get(key)?.();

    pendingCleanups.delete(key);
  }

  function scheduleDestroyItemByKey(key: string) {
    cancelPendingDestroy(key);

    const cancel = createTimeout(() => {
      destroyItemByKey(key);
      pendingCleanups.delete(key);
    }, destroyTimeout);

    pendingCleanups.set(key, cancel);

    return cancel;
  }

  function cancelSession(session: MemoizeSession) {
    const { key } = session;

    if (!aliveSessions.includes(session)) {
      console.warn(`Trying to cleanup session that is not existing or already removed`);
      return;
    }

    removeElementFromArray(aliveSessions, session);

    const isOtherSessionForThisKeyAlive = aliveSessions.some((aliveSession) => aliveSession.key === key);

    if (isOtherSessionForThisKeyAlive) return;

    scheduleDestroyItemByKey(key);
  }

  function getOrReuseItem(args: Args) {
    const key = keyGetter(...args);

    cancelPendingDestroy(key);

    const existingItem = aliveItemsMap.get(key);

    if (existingItem !== undefined) {
      return existingItem;
    }

    const newItem = getter(...args);
    aliveItemsMap.set(key, newItem);

    return newItem;
  }

  function request(...args: Args) {
    const key = keyGetter(...args);

    const session: MemoizeSession = {
      key,
    };

    aliveSessions.push(session);

    const item = getOrReuseItem(args);

    function cancel() {
      cancelSession(session);
    }

    return { item, cancel };
  }

  /**
   * Will get existing warm-memoized item if it exists.
   *
   * Note: will not 'request' given item being created, thus will also not return 'stop requesting' callback.
   */
  function getExistingOnly(...args: Args) {
    const key = keyGetter(...args);

    return aliveItemsMap.get(key) ?? null;
  }

  request.getExistingOnly = getExistingOnly;

  return request;
}
