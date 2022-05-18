/**
 * Will find property descriptor of input for given property.
 *
 * Will walk up the prototype tree to find descriptor, eg
 *
 * For HTMLDivElement and property "scrollTop" it will first check if HTMLDivElement has this own property.
 * It does not, so it'll look in parent (HTMLElement) - it also does not
 * It will look in Element - it does have it so it'll be returned
 */
function findPropertyDescriptor<T extends object>(input: T, property: keyof T) {
  // Check if element has this property defined itself
  let descriptor = Reflect.getOwnPropertyDescriptor(input, property);

  if (descriptor) return descriptor;

  // It does not have it - let's see if any prototype ('class extended') has it
  let currentParentPrototype = Reflect.getPrototypeOf(input);

  // Let's walk up the tree until we reach 'root' prototype (Object) where 'parent' prototype is null
  while (currentParentPrototype) {
    // Check if this parent has descriptor for property
    descriptor = Reflect.getOwnPropertyDescriptor(currentParentPrototype, property);

    // If so, return it
    if (descriptor) return descriptor;

    // Try looking in parent prototype
    currentParentPrototype = Reflect.getPrototypeOf(currentParentPrototype);
  }

  return null;
}

/**
 * Will replace property descriptor of target while allowing us to access original one.
 *
 * Example:
 *
 * Will replace div.scrollTop to return 50, if original scrollTop is bigger than 50. Otherwise returns original scrollTop
 *
 * const div = document.createElement("div")
 *
 * replaceOriginalPropertyDescriptor(div, "scrollTop", (originalDescriptor, div) => {
 *   return {
 *     get() {
 *       const originalScrollTop = originalDescriptor.get.apply(div);
 *
 *       if (originalScrollTop > 50) return 50;
 *
 *       return originalScrollTop
 *     },
 *     // Keep rest of the descriptor (like setter) original
 *     ...originalDescriptor,
 *   }
 * })
 */
export function replaceOriginalPropertyDescriptor<T extends object>(
  input: T,
  property: keyof T,
  newDescriptorCreator: (originalDescriptor: PropertyDescriptor, target: T) => PropertyDescriptor
) {
  const originalDescriptor = findPropertyDescriptor(input, property);

  if (!originalDescriptor) {
    return;
  }

  const newDescriptor = newDescriptorCreator(originalDescriptor, input);

  Reflect.defineProperty(input, property, newDescriptor);
}

function createOneFrameCache<T>(getter: () => T) {
  let currentClearScheduled: ReturnType<typeof requestAnimationFrame> | undefined = undefined;

  let cachedValueForFrame: T | undefined = undefined;

  function clear() {
    currentClearScheduled = undefined;
    cachedValueForFrame = undefined;
  }

  function getCached() {
    if (currentClearScheduled) {
      return cachedValueForFrame!;
    }

    currentClearScheduled = requestAnimationFrame(clear);

    cachedValueForFrame = getter();

    return cachedValueForFrame;
  }

  getCached.clear = clear;

  return getCached;
}

interface ValueBox<T> {
  value: T;
}

function createSelfClearingCache<T>(getter: () => T, onCached: (clear: () => void) => void) {
  let cachedValue: ValueBox<T> | null = null;

  function clear() {
    cachedValue = null;
  }

  function getCached() {
    if (cachedValue) {
      return cachedValue.value;
    }

    const newValue = getter();

    cachedValue = { value: newValue };

    onCached(clear);

    return newValue;
  }

  getCached.clear = clear;

  return getCached;
}

export type KeyOf<T> = T extends infer U ? keyof U : never;

export function makeGetterCached<T extends object>(input: T, key: KeyOf<T>, onCached: (clear: () => void) => void) {
  replaceOriginalPropertyDescriptor(input, key, (originalDescriptor, element) => {
    if (!originalDescriptor.get) {
      return originalDescriptor;
    }

    const getCached = createSelfClearingCache(() => {
      return originalDescriptor.get!.apply(element);
    }, onCached);

    return {
      ...originalDescriptor,
      set(value) {
        getCached.clear();
        originalDescriptor.set!.apply(element, [value]);
      },
      get() {
        return getCached();
      },
    };
  });
}

export function makeGettersOneFrameCached<T extends object>(input: T, keysToCache: Array<keyof T>) {
  for (const keyToCache of keysToCache) {
    replaceOriginalPropertyDescriptor(input, keyToCache, (originalDescriptor, element) => {
      if (!originalDescriptor.get) {
        throw new Error(`Property ${String(keyToCache)} has no getter`);
      }

      const getCached = createOneFrameCache(() => {
        return originalDescriptor.get!.apply(element);
      });

      return {
        ...originalDescriptor,
        set(value) {
          getCached.clear();
          originalDescriptor.set!.apply(element, [value]);
        },
        get() {
          return getCached();
        },
      };
    });
  }
}
