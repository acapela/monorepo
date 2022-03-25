import { Cleanup, MaybeCleanup } from "./types";

export type CleanupOrder = "from-first" | "from-last";

export type CleanupObject = ReturnType<typeof createCleanupObject>;

/**
 * Useful for cases when we have to clean multiple things in effects.
 *
 * ```ts
 * useEffect(() => {
 *   const cleanup = createCleanupObject();
 *
 *   cleanup.add(createTimeout());
 *   cleanup.add(createEvent());
 *
 *   return cleanup.clean;
 * })
 */
export function createCleanupObject(defaultCleanupOrder: CleanupOrder = "from-first") {
  const cleanups = new Set<Cleanup>();
  const cleanupObject = {
    clean(order: CleanupOrder = defaultCleanupOrder) {
      const cleanupsList = [...cleanups];

      if (order === "from-last") {
        cleanupsList.reverse();
      }

      cleanupsList.forEach((cleanup) => {
        cleanups.delete(cleanup);
        cleanup();
      });
    },
    enqueue(...cleanupsToAdd: Array<Cleanup>) {
      cleanupsToAdd.forEach((cleanupToAdd) => {
        cleanups.add(cleanupToAdd);
      });
    },
    set next(cleanupToAdd: MaybeCleanup | void) {
      if (!cleanupToAdd) return;

      cleanups.add(cleanupToAdd);
    },
    get size() {
      return cleanups.size;
    },
  };

  return cleanupObject;
}
