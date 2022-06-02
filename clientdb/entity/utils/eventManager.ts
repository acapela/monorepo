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

/**
 * Works like normal 'pubsub' channel, except if events are emitted during mobx action, will wait till action ends before
 * informing all subscribers. If more than 1 emit was called in one action - will batch informing all of them in one runInAction call.
 *
 * It can prevent UI tering or a lot of reaction calls, eg:
 * when entity store is created, it will call 'itemAdded' for every single item inside one loop. Normally each event emitted would trigger all listeners to react instantly (Eg. index updaters)
 * with this emitter - subscribers will be informed in one batch after all items are added.
 *
 * Note: I'm not 100% sure if there is any race-condition risk related to this approach.
 */
export function createMobxAwareEventsEmmiter<EventsMap extends Record<string, unknown[]>>(
  debug?: string
): EventsEmmiter<EventsMap> {
  const subscribersMap = new Map<keyof EventsMap, Set<EventHandler<unknown[]>>>();

  interface PendingEvent<Type extends keyof EventsMap> {
    type: Type;
    data: EventsMap[Type];
  }

  // Keep pending events in observable array - we'll listen to this array and flush it instantly (in mobx world - instantly after last 'action' call is finished)
  const pendingEvents = observable.array<PendingEvent<keyof EventsMap>>();

  const stop = autorun(() => {
    if (!pendingEvents.length) return;

    // Clone events list (flushing events might result in new events being creted)
    const eventsClone = pendingEvents.slice();

    // Clear pending events before we start flushing
    runUntracked(() => {
      pendingEvents.clear();
    });

    // Flush events in one batch
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
