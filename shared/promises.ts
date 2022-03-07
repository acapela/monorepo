import { assert } from "./assert";

export type MaybePromise<T> = Promise<T> | T;

export async function resolveMaybePromise<T>(maybePromise: MaybePromise<T>): Promise<T> {
  return await maybePromise;
}

export function makePromiseVoidable(input: Promise<unknown>): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    input.then(() => resolve()).catch(reject);
  });
}

export interface ResolvablePromise<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
  getIsComplete(): boolean;
}

export function createResolvablePromise<T = void>(): ResolvablePromise<T> {
  let resolve: (value: T) => void;
  let reject: (error: unknown) => void;
  let didResolve = false;
  let didReject = false;

  function getIsComplete() {
    return didResolve || didReject;
  }

  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = (value) => {
      if (getIsComplete()) return;
      didResolve = true;
      resolvePromise(value);
    };
    reject = (error) => {
      if (getIsComplete()) return;
      didReject = true;
      rejectPromise(error);
    };
  });

  return {
    promise,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    resolve: resolve!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    reject: reject!,
    getIsComplete,
  };
}

/**
 * Creates an async function wrapper that will make sure only one 'instance' of it is
 * running at given time.
 */
export function createSharedPromise<T>(getter: () => Promise<T>) {
  let currentPromise: Promise<T> | null;

  async function get() {
    if (currentPromise) return currentPromise;

    currentPromise = getter();

    try {
      const result = await currentPromise;
      return result;
    } finally {
      currentPromise = null;
    }
  }

  return get;
}

export async function getAsyncWithRepeat<T>(getter: () => Promise<T>, maxRepeats = 3) {
  let attemptIndex = 1;

  assert(maxRepeats >= 1, "Max repeats has to be bigger or equal 1");

  while (attemptIndex <= maxRepeats) {
    try {
      return await getter();
    } catch (error) {
      if (attemptIndex >= maxRepeats) {
        throw error;
      }

      attemptIndex++;
    }
  }

  throw new Error("Unable to get with repeat");
}
