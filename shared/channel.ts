import { useEffect } from "react";

type Cleanup = () => void;

type SubscriberResult = Cleanup | void;

type Subscriber<T> = (value: T) => SubscriberResult;

export function createChannel<T>() {
  const subscribers = new Set<Subscriber<T>>();
  const currentCleanupMap = new Map<Subscriber<T>, Cleanup>();

  function cleanupSubscriber(subscriber: Subscriber<T>) {
    const cleanup = currentCleanupMap.get(subscriber);

    if (!cleanup) {
      return;
    }

    currentCleanupMap.delete(subscriber);

    cleanup();
  }

  function subscribe(subscriber: Subscriber<T>) {
    subscribers.add(subscriber);

    return function stop() {
      cleanupSubscriber(subscriber);
      subscribers.delete(subscriber);
    };
  }

  function publish(value: T) {
    const subscribersList = Array.from(subscribers);
    for (const subscriber of subscribersList) {
      cleanupSubscriber(subscriber);

      const newCleanup = subscriber(value);

      if (newCleanup) {
        currentCleanupMap.set(subscriber, newCleanup);
      }
    }
  }

  function useSubscribe(subscriber: Subscriber<T>) {
    useEffect(() => {
      return subscribe(subscriber);
    }, [subscriber]);
  }

  return {
    subscribe,
    publish,
    useSubscribe,
  };
}
