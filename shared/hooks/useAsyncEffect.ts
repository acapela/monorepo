import { useEffect, EffectCallback, DependencyList } from "react";
import { useIsomorphicLayoutEffect } from "react-use";

type GetIsCancelled = () => boolean;

type Cleanup = () => void;

type AsyncEffect = (getIsCancelled: GetIsCancelled) => Promise<Cleanup | void>;

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
 *   return createTimeout(() => console.log("hello"), 5000);
 * }, [apiParams])
 */

export function useAsyncEffect(effect: AsyncEffect, deps?: DependencyList) {
  useEffect(getEffectCallbackForAsyncEffect(effect), deps);
}

export function useAsyncLayoutEffect(effect: AsyncEffect, deps?: DependencyList) {
  useIsomorphicLayoutEffect(getEffectCallbackForAsyncEffect(effect), deps);
}

function getEffectCallbackForAsyncEffect(asyncEffect: AsyncEffect): EffectCallback {
  return () => {
    let isCancelled = false;

    function getIsCancelled() {
      return isCancelled;
    }

    const effectResultPromise = asyncEffect(getIsCancelled);

    return () => {
      isCancelled = true;

      effectResultPromise.then((maybeCleanup) => {
        if (!maybeCleanup) return;

        maybeCleanup();
      });
    };
  };
}
