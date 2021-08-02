import { ApolloCache } from "@apollo/client";
import { assert } from "console";
import { getRenderedApolloClient } from "~frontend/apollo/client";

let currentApolloProxy: ApolloCache<unknown> | null = null;

/**
 * Will return either optimistic or actual apollo cache depending on currently running operation.
 */
export function getCurrentApolloClientCache() {
  if (currentApolloProxy) return currentApolloProxy;

  return getRenderedApolloClient().cache;
}

export function runWithApolloProxy(cache: ApolloCache<unknown>, callback: () => void) {
  const previousProxy = currentApolloProxy;

  currentApolloProxy = cache;

  callback();

  currentApolloProxy = previousProxy;
}
