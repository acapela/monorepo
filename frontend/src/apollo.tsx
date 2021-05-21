import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache, split as splitLinks } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import Cookie from "js-cookie";
import { memoize } from "lodash";
import { NextApiRequest } from "next";
import { IncomingMessage } from "node:http";
import React, { ReactNode } from "react";
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

function createSocketLink(websocketEndpoint?: string) {
  const rootUrl = websocketEndpoint ?? "";
  return new WebSocketLink({
    uri: `${rootUrl}/v1/graphql`,
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

interface ApolloClientOptions {
  forcedAuthToken?: string;
  websocketEndpoint?: string;
}

export const getApolloClient = memoize(
  (options: ApolloClientOptions): ApolloClient<unknown> => {
    const ssrMode = typeof window === "undefined";

    if (!ssrMode) {
      // Client side - never use forced token and always read one dynamically
      options.forcedAuthToken = undefined;
    }

    const authTokenLink = createAuthorizationHeaderLink(options.forcedAuthToken);

    function getLink() {
      if (ssrMode) {
        return authTokenLink.concat(httpLink);
      }

      return splitLinks(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return definition.kind === "OperationDefinition" && definition.operation === "subscription";
        },
        createSocketLink(options.websocketEndpoint),
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
  children: ReactNode;
  // On server side, queries are pre-populated using authorized client. This props allows using the same client instance,
  // resulting in initial render having all data in place and avoiding loading state.
  ssrAuthToken?: string | null;
  websocketEndpoint?: string | null;
}

export const ApolloClientProvider = ({ children, ssrAuthToken, websocketEndpoint }: ApolloClientProviderProps) => {
  const client = getApolloClient({
    forcedAuthToken: ssrAuthToken ?? undefined,
    websocketEndpoint: websocketEndpoint ?? undefined,
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
