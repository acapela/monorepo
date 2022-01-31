type CleanupFunction = () => void;

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
  const cleanups = new Set<CleanupFunction>();
  const cleanupObject = {
    clean() {
      cleanups.forEach((cleanup) => {
        cleanups.delete(cleanup);
        cleanup();
      });
    },
    enqueue(...cleanupsToAdd: Array<CleanupFunction>) {
      cleanupsToAdd.forEach((cleanupToAdd) => {
        cleanups.add(cleanupToAdd);
      });
    },
    set next(cleanupToAdd: CleanupFunction) {
      cleanups.add(cleanupToAdd);
    },
  };

  return cleanupObject;
}
