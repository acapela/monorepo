import { ClientRect } from "@dnd-kit/core";

const cacheMap = new Map<HTMLElement, ClientRect>();

let currentCleanup: ReturnType<typeof requestAnimationFrame> | undefined = undefined;

function clean() {
  currentCleanup = undefined;

  cacheMap.clear();
}

function scheduleCleanup() {
  if (currentCleanup) return;

  currentCleanup = requestAnimationFrame(clean);
}

export function cachedMeasureRect(element: HTMLElement) {
  const cached = cacheMap.get(element);

  if (cached) {
    return cached;
  }

  const { top, left, width, height, bottom, right } = element.getBoundingClientRect();

  const newRect: ClientRect = {
    top,
    left,
    width,
    height,
    bottom,
    right,
  };

  cacheMap.set(element, newRect);

  scheduleCleanup();

  return newRect;
}
