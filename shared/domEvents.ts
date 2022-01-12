import { noop } from "lodash";
import { RefObject, useEffect } from "react";

import { isServer } from "@aca/shared/isServer";

import { useBoolean } from "./hooks/useBoolean";

export function createWindowEvent<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions
) {
  if (isServer) return noop;

  window.addEventListener(type, handler, options);

  return function cancel() {
    window.removeEventListener(type, handler, options);
  };
}

export function useWindowEvent<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions
) {
  useEffect(() => {
    return createWindowEvent(type, handler, options);
  }, [type, handler, options]);
}

export function createDocumentEvent<K extends keyof DocumentEventMap>(
  type: K,
  handler: (event: DocumentEventMap[K]) => void,
  options?: AddEventListenerOptions
) {
  if (typeof document === "undefined") return noop;

  document.addEventListener(type, handler, options);

  return function cancel() {
    document.removeEventListener(type, handler, options);
  };
}

interface HookEventOptions extends AddEventListenerOptions {
  isEnabled?: boolean;
}

export function useDocumentEvent<K extends keyof DocumentEventMap>(
  type: K,
  handler: (event: DocumentEventMap[K]) => void,
  options?: HookEventOptions
) {
  useEffect(() => {
    if (options?.isEnabled === false) return;
    return createDocumentEvent(type, handler, options);
  }, [type, handler, options]);
}

export function useDebouncedDocumentEvent<K extends keyof DocumentEventMap>(
  type: K,
  handler: (event: DocumentEventMap[K]) => void,
  timeout: number,
  options?: HookEventOptions
) {
  const [isDebouncing, { set: startDebounceWindow, unset: endDebounceWindow }] = useBoolean(false);

  useDocumentEvent(type, debouncedHandler, options);

  function debouncedHandler(event: DocumentEventMap[K]) {
    if (isDebouncing) {
      return;
    }

    handler(event);
    startDebounceWindow();

    setTimeout(endDebounceWindow, timeout);
  }
}

export function createElementEvent<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  type: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
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
  options?: HookEventOptions
) {
  useEffect(() => {
    if (options?.isEnabled === false) return;
    const element = ref.current;

    if (!element) return;

    return createElementEvent(element, type, handler, options);
  }, [ref, ref.current, type, handler, options]);
}

export function createElementEvents<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  types: Array<K>,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
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
