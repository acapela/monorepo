import { useEffect } from "react";

/**
 * Attaches a listener for an event type to an element.
 */
export function useEventListener<EventType extends keyof HTMLElementEventMap>(
  element: HTMLElement | null | undefined,
  eventType: EventType,
  listener: (this: HTMLElement, evt: HTMLElementEventMap[EventType]) => void
) {
  useEffect(() => {
    if (!element) {
      return;
    }
    element.addEventListener(eventType, listener);
    return () => {
      element.removeEventListener(eventType, listener);
    };
  }, [element, eventType]);
}
