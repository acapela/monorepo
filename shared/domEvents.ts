import { RefObject, useEffect } from "react";

export function createWindowEvent<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
) {
  window.addEventListener(type, handler, options);

  return function cancel() {
    window.removeEventListener(type, handler, options);
  };
}

export function useWindowEvent<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
) {
  useEffect(() => {
    return createWindowEvent(type, handler, options);
  }, [type, handler, options]);
}

export function createDocumentEvent<K extends keyof DocumentEventMap>(
  type: K,
  handler: (event: DocumentEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
) {
  document.addEventListener(type, handler, options);

  return function cancel() {
    document.removeEventListener(type, handler, options);
  };
}

export function useDocumentEvent<K extends keyof DocumentEventMap>(
  type: K,
  handler: (event: DocumentEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
) {
  useEffect(() => {
    return createDocumentEvent(type, handler, options);
  }, [type, handler, options]);
}

export function createElementEvent<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  type: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
) {
  element.addEventListener(type, handler, options);

  return function cancel() {
    element.removeEventListener(type, handler, options);
  };
}

export function useElementEvent<K extends keyof HTMLElementEventMap>(
  ref: RefObject<HTMLElement>,
  type: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
) {
  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    return createElementEvent(element, type, handler, options);
  }, [ref, ref.current, type, handler, options]);
}

export function createElementEvents<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  types: Array<K>,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
) {
  const cleanups = types.map((type) => {
    return createElementEvent(element, type, handler, options);
  });

  return function cancel() {
    cleanups.forEach((cleanup) => {
      cleanup();
    });
  };
}
