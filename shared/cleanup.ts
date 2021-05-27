type CleanupFunction = () => void;
type CleanupObject = { clean: CleanupFunction } & { [key: string]: CleanupFunction | null };

/**
 * Useful for cases when we have to clean multiple things in effects.
 *
 * ```ts
 * useEffect(() => {
 *   const cleanup = createCleanupObject();
 *
 *   cleanup.foo = createTimeout();
 *   cleanup.bar = createEvent();
 *
 *   return cleanup.clean;
 * })
 */
export function createCleanupObject() {
  const cleanupObject: CleanupObject = {
    clean() {
      Object.keys(cleanupObject).forEach((key) => {
        if (key === "clean") return;

        const cleanupFunction = cleanupObject[key];

        cleanupObject[key] = null;

        cleanupFunction?.();
      });
    },
  };

  return cleanupObject;
}
