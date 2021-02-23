import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, split as splitLinks } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { ApolloLink } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { useEffect, useMemo, useState } from "react";
import { GRAPHQL_SUBSCRIPTION_HOST } from "./config";

const TOKEN_COOKIE_NAME = "next-auth.session-token";

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

const createApolloClient = (): ApolloClient<unknown> => {
  const httpLink = new HttpLink({
    uri: "/graphql",
  });

  const socketLink = new WebSocketLink({
    uri: `${GRAPHQL_SUBSCRIPTION_HOST}/v1/graphql`,

    options: {
      reconnect: true,

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

  const splitLink = splitLinks(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === "OperationDefinition" && definition.operation === "subscription";
    },
    socketLink,
    authorizationHeaderLink.concat(httpLink)
  );

  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });
};

function useIsClientSide() {
  return typeof window !== "undefined";
}

const useApolloClient = (): ApolloClient<unknown> | null => {
  const isClientSide = useIsClientSide();

  return useMemo(() => {
    if (isClientSide) {
      return createApolloClient();
    }

    return null;
  }, [isClientSide]);
};

export const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const client = useApolloClient();

  if (client) {
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
  }

  return <>{children}</>;
};
