import Cookie from "js-cookie";
import React from "react";
import { GRAPHQL_SUBSCRIPTION_HOST } from "~frontend/config";

import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache, split as splitLinks } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const TOKEN_COOKIE_NAME = "next-auth.session-token";

function readCurrentToken(): string | null {
  return Cookie.get(TOKEN_COOKIE_NAME) ?? null;
}

const authorizationHeaderLink = new ApolloLink((operation, forward) => {
  const authToken = readCurrentToken();

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
  const socketLink = new WebSocketLink({
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

  return socketLink;
}

const httpLink = new HttpLink({ uri: "/graphql" });

const createApolloClient = (): ApolloClient<unknown> => {
  const ssrMode = typeof window === "undefined";

  const link = ssrMode
    ? authorizationHeaderLink.concat(httpLink)
    : splitLinks(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return definition.kind === "OperationDefinition" && definition.operation === "subscription";
        },
        createSocketLink(),
        authorizationHeaderLink.concat(httpLink)
      );

  return new ApolloClient({
    ssrMode,
    link,
    cache: new InMemoryCache(),
  });
};

export const apolloClient = createApolloClient();

export const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
