import { createCleanupObject } from "@aca/shared/cleanup";

import { makeGetterCached, replaceOriginalPropertyDescriptor } from "./frameCache";

const alreadyWrapped = new WeakSet<Window>();

const keysToCache: Array<keyof Window> = ["innerWidth", "innerHeight"];

export function makeWindowMeasureCached(window: Window) {
  if (alreadyWrapped.has(window)) return;

  const cacheCleanups = createCleanupObject();

  for (const key of keysToCache) {
    makeGetterCached(window, key, cacheCleanups.enqueue);
  }

  window.addEventListener("resize", () => {
    cacheCleanups.clean();
  });

  makeComputedStylesCached(window);

  alreadyWrapped.add(window);
}

type GetComputedStylesFunction = typeof getComputedStyle;

function makeComputedStylesCached(window: Window) {
  replaceOriginalPropertyDescriptor(window, "getComputedStyle", (originalDescriptor) => {
    const originalFunction = originalDescriptor.value as GetComputedStylesFunction;

    interface Cached {
      style: string | null;
      className: string;
      styles: CSSStyleDeclaration;
    }

    const cache = new WeakMap<Element, Cached>();

    const cachedFunction: GetComputedStylesFunction = (element, pseudoElement) => {
      if (!(element instanceof HTMLElement)) {
        return originalFunction.apply(window, [element, pseudoElement]);
      }

      if (pseudoElement) {
        return originalFunction.apply(window, [element, pseudoElement]);
      }

      const cachedValue = cache.get(element);

      const className = element.className;
      const style = element.getAttribute("style");

      if (cachedValue && cachedValue.style === style && cachedValue.className === className) {
        return cachedValue.styles;
      }

      const newStyles = originalFunction.apply(window, [element, pseudoElement]);

      cache.set(element, { className, style, styles: newStyles });

      return newStyles;
    };

    return {
      ...originalDescriptor,
      value: cachedFunction,
    };
  });
}
