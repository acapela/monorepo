import { useEffect } from "react";

import { createCleanupObject } from "@aca/shared/cleanup";
import { createDocumentEvent, createWindowEvent } from "@aca/shared/domEvents";
import { isServer } from "@aca/shared/isServer";

function getEventNamesFromProperties(properties: string[]) {
  return properties
    .filter((windowKey) => {
      return windowKey.startsWith("on");
    })
    .map((onEventName) => {
      return onEventName.substr(2);
    });
}

function getAllWindowEventNames(): Array<keyof WindowEventMap> {
  if (isServer) return [];

  return getEventNamesFromProperties(Object.keys(window)) as Array<keyof WindowEventMap>;
}

function getAllDocumentEventNames(): Array<keyof DocumentEventMap> {
  if (typeof document === "undefined") return [];

  const documentRoot = Object.getPrototypeOf(Object.getPrototypeOf(document));

  return getEventNamesFromProperties(Object.keys(documentRoot)) as Array<keyof DocumentEventMap>;
}

interface Options {
  ignoredEvents?: string[];
}

export function debugAllEvents(options?: Options) {
  if (process.env.NODE_ENV !== "development") {
    return () => {
      //
    };
  }

  function isEventNameIgnored(eventName: string) {
    if (!options?.ignoredEvents) return false;

    return options.ignoredEvents.some((ignoredEvent) => {
      if (ignoredEvent === eventName) return true;
      if (eventName.includes(ignoredEvent)) return true;

      return false;
    });
  }

  const cleanup = createCleanupObject();

  const windowEventNames = getAllWindowEventNames();
  const documentEventNames = getAllDocumentEventNames();

  windowEventNames.forEach((windowEventName) => {
    if (isEventNameIgnored(windowEventName)) return;
    cleanup.enqueue(
      createWindowEvent(
        windowEventName,
        (event) => {
          console.info(`[${windowEventName}] (window)`, event.target, event);
        },
        { capture: true }
      )
    );
  });

  documentEventNames.forEach((documentEventName) => {
    if (isEventNameIgnored(documentEventName)) return;
    cleanup.enqueue(
      createDocumentEvent(
        documentEventName,
        (event) => {
          console.info(`[${documentEventName}] (document)`, event.target, event);
        },
        { capture: true }
      )
    );
  });

  return () => {
    cleanup.clean();
  };
}

export function useDebugAllEvents(options?: Options) {
  useEffect(() => {
    return debugAllEvents(options);
  }, [options]);
}
