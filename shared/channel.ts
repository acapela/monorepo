import { useEffect, useState } from "react";
import { useConst } from "~frontend/src/hooks/useConst";

type Cancel = () => void;

export interface Channel<T> {
  getLastValue(): T | null;
  publish(value: T): void;
  subscribe(subscriber: Subscriber<T>): Cancel;
  useLastValue(): T | null;
  useSubscribe(subscriber: Subscriber<T>): void;
}

type ValueWrapper<T> = { value: T } | null;

type Subscriber<T> = (value: T) => void;

export function createChannel<T>(): Channel<T> {
  const subscribers = new Set<Subscriber<T>>();

  let lastValue: ValueWrapper<T> = null;

  function getLastValue() {
    if (!lastValue) return null;

    return lastValue.value;
  }

  function subscribe(subscriber: Subscriber<T>) {
    subscribers.add(subscriber);

    return function clear() {
      subscribers.delete(subscriber);
    };
  }

  function publish(value: T, forceOnEqualValue = false) {
    if (!forceOnEqualValue && lastValue && value === lastValue.value) {
      // return;
    }

    lastValue = { value };

    Array.from(subscribers).forEach((subscriber) => {
      subscriber(value);
    });
  }

  function useLastValue() {
    const [value, setValue] = useState(getLastValue);

    useEffect(() => {
      return subscribe(setValue);
    });

    return value;
  }

  function useSubscribe(subscriber: Subscriber<T>) {
    useEffect(() => {
      return subscribe(subscriber);
    });
  }

  return {
    getLastValue,
    publish,
    subscribe,
    useLastValue,
    useSubscribe,
  };
}

export function useChannel<T>() {
  return useConst(() => createChannel<T>());
}
