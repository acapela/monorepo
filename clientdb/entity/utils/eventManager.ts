type EventHandler<T extends unknown[]> = (...args: T) => void;

type Unsubscribe = () => void;

export type EventsEmmiter<EventsMap extends Record<string, unknown[]>> = {
  on<N extends keyof EventsMap>(name: N, handler: EventHandler<EventsMap[N]>): Unsubscribe;
  emit<N extends keyof EventsMap>(name: N, ...data: EventsMap[N]): void;
};

export function createEventsEmmiter<EventsMap extends Record<string, unknown[]>>(
  debug = false
): EventsEmmiter<EventsMap> {
  const subscribersMap = new Map<keyof EventsMap, Set<EventHandler<unknown[]>>>();

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
    function doEmit() {
      if (debug) {
        console.info(`Event`, name, data);
      }
      const listeners = getHandlersForEvent(name);

      Array.from(listeners).forEach((listener) => {
        listener(...data);
      });
    }

    return doEmit();

    // if (!nextTick) {
    //   return doEmit();
    // }

    // setImmediate(doEmit);
  }

  return {
    on,
    emit,
  };
}
