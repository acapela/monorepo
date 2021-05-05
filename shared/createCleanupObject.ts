type CleanupObject = { clean: () => void } & Record<string, () => void>;

/**
 * It is 'code sugar' useful when we want to create multiple cleanup functions (eg multiple dom events stop listening)
 * and then call them all at once.
 *
 * Useage:
 *
 * ```ts
 *   const cleanup = createCleanupObject();
 *
 *   cleanup.fooEnter = createElementEvent('enter');
 *   cleanup.fooLeave = createElementEvent('leave');
 *
 *   return () => cleanup.clean()
 * ```
 *
 * Instead of:
 *
 * ```ts
 * const cleanEnter = createElementEvent('enter');
 * const cleanLeave = createElementEvent('leave');
 *
 * return () => {
 *   cleanEnter();
 *   cleanLeave();
 * }
 * ```
 */
export function createCleanupObject() {
  const cleanupObject: CleanupObject = {
    clean() {
      Object.keys(cleanupObject).forEach((key) => {
        if (key === "clean") return;

        const cleanupFunction = cleanupObject[key];

        if (typeof cleanupFunction !== "function") return;

        Reflect.deleteProperty(cleanupObject, key);

        cleanupFunction();
      });
    },
  };

  return cleanupObject;
}
