import { autorun, observable, runInAction } from "mobx";

import { IS_DEV } from "@aca/shared/dev";
import { runUntracked } from "@aca/shared/mobx/utils";

type EventHandler<T extends unknown[]> = (...args: T) => void;

type Unsubscribe = () => void;

export type EventsEmmiter<EventsMap extends Record<string, unknown[]>> = {
  on<N extends keyof EventsMap>(name: N, handler: EventHandler<EventsMap[N]>): Unsubscribe;
  emit<N extends keyof EventsMap>(name: N, ...data: EventsMap[N]): void;
  destroy(): void;
};

const DEV_DEBUG_EVENTS = false;

export function createEventsEmmiter<EventsMap extends Record<string, unknown[]>>(
  debug?: string
): EventsEmmiter<EventsMap> {
  const subscribersMap = new Map<keyof EventsMap, Set<EventHandler<unknown[]>>>();

  interface PendingEvent<Type extends keyof EventsMap> {
    type: Type;
    data: EventsMap[Type];
  }

  const pendingEvents = observable.array<PendingEvent<keyof EventsMap>>();

  const stop = autorun(() => {
    if (!pendingEvents.length) return;

    const eventsClone = pendingEvents.slice();

    runUntracked(() => {
      pendingEvents.clear();
    });

    runInAction(() => {
      eventsClone.forEach((event) => {
        const listeners = getHandlersForEvent(event.type);

        listeners.forEach((listener) => {
          listener(...event.data);
        });
      });
    });
  });

  function getHandlersForEvent<N extends keyof EventsMap>(name: N): Set<EventHandler<EventsMap[N]>> {
    const existingSet = subscribersMap.get(name);

    if (existingSet) return existingSet;

    const newSet = new Set<EventHandler<unknown[]>>();

    subscribersMap.set(name, newSet);

    return newSet;
  }

  function on<N extends keyof EventsMap>(name: N, handler: EventHandler<EventsMap[N]>) {
    const listeners = getHandlersForEvent(name);

    listeners.add(handler);

    return () => {
      listeners.delete(handler);
    };
  }

  function emit<N extends keyof EventsMap>(name: N, ...data: EventsMap[N]) {
    if (IS_DEV && DEV_DEBUG_EVENTS && debug) {
      console.warn(`Event [${debug}]`, name, data);
    }

    runInAction(() => {
      pendingEvents.push({ type: name, data });
    });
  }

  return {
    on,
    emit,
    destroy() {
      stop();
    },
  };
}
