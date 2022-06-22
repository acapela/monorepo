import Client from "ioredis";
import { isEqual } from "lodash";

import { assert } from "@aca/shared/assert";
import { IS_DEV } from "@aca/shared/dev";
import { createResolvablePromise } from "@aca/shared/promises";

export const redisClient = new Client({ host: process.env.REDIS_HOST });

function safeSerialize(input: unknown) {
  const serialized = JSON.stringify(input);
  const parsed = JSON.parse(serialized);

  assert(isEqual(parsed, input), "Cannot safely serialize input");

  return serialized;
}

/**
 * Creates wrapper around async function that will use redis for caching.
 *
 * Note: arguments provided to the function must be JSON serializable, otherwise it will throw an error.
 */
export function redisCached<A extends unknown[], R>(
  key: string,
  expireTime: number,
  getter: (...args: A) => Promise<R>
) {
  /**
   * If function is called multiple times before first result is saved to redis - we'll return previous promise instead of executing getter multiple times
   */
  const currentResultPromiseForCacheKey = new Map<string, Promise<R>>();

  async function getCachedOrCreate(...args: A) {
    if (IS_DEV) {
      return getter(...args);
    }

    const cacheKey = `${key}` + safeSerialize(args);

    // It was already called and is not yet saved to redis
    const alreadyInProgressPromise = currentResultPromiseForCacheKey.get(cacheKey);

    if (alreadyInProgressPromise) {
      return alreadyInProgressPromise;
    }

    // There is no pending promise - if we have redis cached, return it
    const cachedResult = await redisClient.get(cacheKey);

    if (cachedResult !== null) {
      return JSON.parse(cachedResult) as R;
    }

    // There is no pending promise and no redis value

    // Create promise to share with other calls before we save to redis
    const inProgressPromise = createResolvablePromise<R>();

    currentResultPromiseForCacheKey.set(cacheKey, inProgressPromise.promise);

    try {
      // get new value and save it to redis
      const newValue = await getter(...args);

      await redisClient.set(cacheKey, JSON.stringify(newValue), "PX", expireTime);

      // When done - remove pending promise before resolving it
      currentResultPromiseForCacheKey.delete(cacheKey);

      inProgressPromise.resolve(newValue);

      return newValue;
    } catch (error) {
      // If getting throws - we must also reject pending promises
      inProgressPromise.reject(error);
      throw error;
    }
  }

  return getCachedOrCreate;
}
