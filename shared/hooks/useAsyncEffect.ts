import { DependencyList, EffectCallback, useEffect, useRef } from "react";

import { createResolvablePromise } from "@aca/shared/promises";

type GetIsCancelled = () => boolean;

type Cleanup = () => void;

interface AsyncEffectInput {
  getIsCancelled: GetIsCancelled;
  waitForPreviousEffectToResolve(): Promise<void>;
}

type AsyncEffect = (input: AsyncEffectInput) => Promise<Cleanup | void>;

/**
 * This module allows creating async effects in hooks.
 *
 * There are one main differences between sync and async effect:
 *
 * It is possible in async effect that our effect host component is no longer mounted when our async call resolves
 *
 * Therefore we provide `getIsCancelled` function that allows us to stop async function if needed eg:
 *
 * // Fetching api
 * const [response, setResponse] = useState(null);
 * useAsyncEffect(async (getIsCancelled) => {
 *   const apiResponse = await api.fetch(apiParams);
 *
 *   // At this point it is possible that our component is no longer mounted so setting state would result in warning
 *   if (getIsCancelled()) return;
 *
 *   // We know component is still mounted, let's use our data
 *   setResponse(apiResponse);
 *
 *   // We can also return cleanup at any point in async function
 *   return createTimeout(() => console.info("hello"), 5000);
 * }, [apiParams])
 */

export function useAsyncEffect(effect: AsyncEffect, deps?: DependencyList) {
  const currentPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    const currentPromise = currentPromiseRef.current;

    const asyncEffect = getEffectCallbackForAsyncEffect(effect, () => currentPromise);

    currentPromiseRef.current = asyncEffect.resolvePromise;

    return asyncEffect.callback();
  }, deps);
}

interface AsyncEffectData {
  callback: EffectCallback;
  resolvePromise: Promise<void>;
}

function getEffectCallbackForAsyncEffect(
  asyncEffect: AsyncEffect,
  getPreviousPromise: () => Promise<void> | null
): AsyncEffectData {
  const resolvePromise = createResolvablePromise<void>();
  const callback = () => {
    let isCancelled = false;

    function getIsCancelled() {
      return isCancelled;
    }

    const effectResultPromise = asyncEffect({
      getIsCancelled,
      async waitForPreviousEffectToResolve() {
        await getPreviousPromise();
      },
    });

    return () => {
      isCancelled = true;

      effectResultPromise.then((maybeCleanup) => {
        if (!maybeCleanup) {
          resolvePromise.resolve();
          return;
        }

        maybeCleanup();

        resolvePromise.resolve();
      });
    };
  };

  return {
    callback,
    resolvePromise: resolvePromise.promise,
  };
}
