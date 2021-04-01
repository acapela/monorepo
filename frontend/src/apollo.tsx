import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache, split as splitLinks } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import React from "react";
import { GRAPHQL_SUBSCRIPTION_HOST } from "./config";

const TOKEN_COOKIE_NAME = "next-auth.session-token";

// TODO: Eh? There are libraries for this
function getCookieByName(cookieName: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const segmentedCookies = `; ${document.cookie}`;

  const parts = segmentedCookies.split(`; ${cookieName}=`);

  if (parts.length !== 2) {
    return null;
  }

  return parts[1].split(";")[0] ?? null;
}

function readCurrentToken(): string | null {
  return getCookieByName(TOKEN_COOKIE_NAME);
}

function isServerSide() {
  return typeof window === "undefined";
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

const socketLink = (function createSocketLink() {
  // Return dummy link for the server
  if (isServerSide()) {
    return new ApolloLink((operation, forward) => forward(operation));
  }

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
})();

const httpLink = new HttpLink({ uri: "/graphql" });

const createApolloClient = (): ApolloClient<unknown> => {
  const directionalLink = splitLinks(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === "OperationDefinition" && definition.operation === "subscription";
    },
    socketLink,
    authorizationHeaderLink.concat(httpLink)
  );

  return new ApolloClient({
    ssrMode: isServerSide(),
    link: directionalLink,
    cache: new InMemoryCache(),
  });
};

export const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const client = createApolloClient();

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
