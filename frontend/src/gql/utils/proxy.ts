import { ApolloCache } from "@apollo/client";

import { getRenderedApolloClient } from "~frontend/apollo/client";

let currentApolloProxy: ApolloCache<unknown> | null = null;

export function getCurrentApolloClientHandler() {
  if (currentApolloProxy) return currentApolloProxy;

  return getRenderedApolloClient();
}

export function runWithApolloProxy(cache: ApolloCache<unknown>, callback: () => void) {
  const previousProxy = currentApolloProxy;

  currentApolloProxy = cache;

  callback();

  currentApolloProxy = previousProxy;
}
