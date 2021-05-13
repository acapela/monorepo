import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache, split as splitLinks } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import Cookie from "js-cookie";
import { memoize } from "lodash";
import { NextApiRequest } from "next";
import { IncomingMessage } from "node:http";
import React from "react";
import { GRAPHQL_SUBSCRIPTION_HOST } from "./config";
import { getApolloInitialState } from "./gql/hydration";

const TOKEN_COOKIE_NAME = "next-auth.session-token";

function readCurrentToken(): string | null {
  return Cookie.get(TOKEN_COOKIE_NAME) ?? null;
}

export function readTokenFromRequest(req?: IncomingMessage): string | null {
  if (!req) return null;

  const nextRequest = req as NextApiRequest;
  return nextRequest.cookies?.[TOKEN_COOKIE_NAME] ?? null;
}

const createAuthorizationHeaderLink = (forcedAuthToken?: string) =>
  new ApolloLink((operation, forward) => {
    const authToken = forcedAuthToken ?? readCurrentToken();

    if (!authToken) {
      return forward(operation);
    }

    operation.setContext({
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return forward(operation);
  });

function createSocketLink() {
  return new WebSocketLink({
    uri: `${GRAPHQL_SUBSCRIPTION_HOST}/v1/graphql`,
    options: {
      reconnect: true,
      lazy: true,
      connectionParams: () => {
        const authToken = readCurrentToken();

        if (!authToken) {
          return {};
        }

        return {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        };
      },
    },
  });
}

function getGraphqlUrl() {
  const rootUrl = process.env.FRONTEND_URL ?? "";

  return `${rootUrl}/graphql`;
}

const httpLink = new HttpLink({ uri: getGraphqlUrl() });

export const getApolloClient = memoize(
  (forcedAuthToken?: string): ApolloClient<unknown> => {
    const ssrMode = typeof window === "undefined";

    if (!ssrMode) {
      // Client side - never use forced token and always read one dynamically
      forcedAuthToken = undefined;
    }

    const authTokenLink = createAuthorizationHeaderLink(forcedAuthToken);

    function getLink() {
      if (ssrMode) {
        return authTokenLink.concat(httpLink);
      }

      return splitLinks(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return definition.kind === "OperationDefinition" && definition.operation === "subscription";
        },
        createSocketLink(),
        authTokenLink.concat(httpLink)
      );
    }

    const link = getLink();

    // Create cache and try to populate it if there is pre-fetched data
    const cache = new InMemoryCache();
    const initialCacheState = getApolloInitialState();

    if (initialCacheState) {
      cache.restore(initialCacheState);
    }

    return new ApolloClient({
      ssrMode,
      link,
      cache,
    });
  }
);

interface ApolloClientProviderProps {
  children: React.ReactNode;
  // On server side, queries are pre-populated using authorized client. This props allows using the same client instance,
  // resulting in initial render having all data in place and avoiding loading state.
  ssrAuthToken?: string | null;
}

export const ApolloClientProvider = ({ children, ssrAuthToken }: ApolloClientProviderProps) => {
  const client = getApolloClient(ssrAuthToken ?? undefined);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
