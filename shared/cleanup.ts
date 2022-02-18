import { Cleanup, MaybeCleanup } from "./types";

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
export function createCleanupObject() {
  const cleanups = new Set<Cleanup>();
  const cleanupObject = {
    clean() {
      cleanups.forEach((cleanup) => {
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
  };

  return cleanupObject;
}
