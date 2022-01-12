import { useEffect, useState } from "react";

import { useConst } from "@aca/shared/hooks/useConst";

type Cancel = () => void;

export interface Channel<T> {
  getLastValue(): T | null;
  publish(value: T): void;
  subscribe(subscriber: Subscriber<T>): Cancel;
  useLastValue(): T | null;
  useSubscribe(subscriber: Subscriber<T>): void;
  useLastValueSelector<R>(selector: (lastValue: T | null) => R): R;
}

type ValueWrapper<T> = { value: T } | null;

type Subscriber<T> = (value: T) => void;

/**
 * Creates simple channel that allows creating pub-sub connection.
 *
 * It might be useful when integrating non-react tools like Quill with react in reactive manner.
 *
 * It might also be useful in React contexts where we want allowing sharing and updating some value without being
 * required to re-render entire context on each change.
 *
 * In such case, instead of passing value and setter to the context, we pass channel that can be subscribed to or published to.
 */
export function createChannel<T>(): Channel<T> {
  const subscribers = new Set<Subscriber<T>>();

  let lastValue: ValueWrapper<T> = null;

  function getLastValue() {
    if (!lastValue) return null;

    return lastValue.value;
  }

  function subscribe(subscriber: Subscriber<T>, includeLastValue = true) {
    subscribers.add(subscriber);

    if (includeLastValue && lastValue) {
      subscriber(lastValue.value);
    }

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
      return subscribe(setValue, false);
    });

    return value;
  }

  function useLastValueSelector<R>(selector: (lastValue: T | null) => R): R {
    const [selectedValue, setSelectedValue] = useState(() => {
      return selector(getLastValue());
    });

    useSubscribe((newValue) => {
      setSelectedValue(selector(newValue));
    }, false);

    return selectedValue;
  }

  function useSubscribe(subscriber: Subscriber<T>, includeLastValue = true) {
    useEffect(() => {
      return subscribe(subscriber, includeLastValue);
    }, [includeLastValue]);
  }

  return {
    getLastValue,
    publish,
    subscribe,
    useLastValue,
    useSubscribe,
    useLastValueSelector,
  };
}

export function useChannel<T>() {
  return useConst(() => createChannel<T>());
}
