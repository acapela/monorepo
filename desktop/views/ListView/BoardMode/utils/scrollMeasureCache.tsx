import { getScrollableAncestors } from "@dnd-kit/core";

import { createCleanupObject } from "@aca/shared/cleanup";

import { makeGetterCached } from "./frameCache";

const alreadyWrapped = new WeakSet<HTMLElement | Window>();

const keysToCache: Array<keyof HTMLElement | keyof Window> = [
  "scrollTop",
  "scrollLeft",
  "scrollWidth",
  "scrollHeight",
  "scrollX",
  "scrollY",
];

export function makeScrollMeasurmentsCached(element: HTMLElement | Window) {
  if (alreadyWrapped.has(element)) return;

  const cacheCleanups = createCleanupObject();

  for (const key of keysToCache) {
    makeGetterCached(element, key, cacheCleanups.enqueue);
  }

  element.addEventListener("scroll", () => {
    cacheCleanups.clean();
  });

  alreadyWrapped.add(element);
}

export function makeScrollableAncestorsScrollMeasurmentsCached(element: HTMLElement) {
  const scrollableAncestors = getScrollableAncestors(element);

  for (const scrollableAncestor of scrollableAncestors) {
    makeScrollMeasurmentsCached(scrollableAncestor as HTMLElement);
  }

  makeScrollMeasurmentsCached(element.ownerDocument.defaultView as Window);
}
