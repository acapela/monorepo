import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  FieldMergeFunction,
  HttpLink,
  InMemoryCache,
  split as splitLinks,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { GraphQLError } from "graphql";
import { onError } from "@apollo/client/link/error";
import { getMainDefinition } from "@apollo/client/utilities";
import { IncomingMessage } from "http";
import { TypedTypePolicies } from "~gql";
import { memoize } from "lodash";
import { NextApiRequest } from "next";
import React, { ReactNode } from "react";
import { getApolloInitialState } from "./gql/utils/hydration";
import { useConst } from "~shared/hooks/useConst";
import { addToast } from "~ui/toasts/data";
import { readAppInitialPropByName } from "./utils/next";
import { assertGet } from "~shared/assert";
import { TOKEN_COOKIE_NAME, readCurrentToken } from "./authentication/cookie";

const mergeUsingIncoming: FieldMergeFunction<unknown, unknown> = (old, fresh) => fresh;

const typePolicies: TypedTypePolicies = {
  space_member: {
    keyFields: ["space_id", "user_id"],
    merge: mergeUsingIncoming,
  },
  space: {
    fields: {
      members: {
        keyArgs: ["user_id"],
        merge: mergeUsingIncoming,
      },
    },
  },
};

// Create cache and try to populate it if there is pre-fetched data
const cache = new InMemoryCache({ typePolicies });

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
  const rootUrl = process.env.FRONTEND_URL ?? process.env.NEXTAUTH_URL ?? "";

  return `${rootUrl}/graphql`;
}

function formatGraphqlErrorMessage(error: GraphQLError) {
  if (process.env.NODE_ENV === "development") {
    const { message, locations, path } = error;
    return `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`;
  }

  return `Failed to finish the operation`;
}

// Log any GraphQL errors or network error that occurred
const errorLink = onError(({ graphQLErrors = [], networkError }) => {
  for (const graphqlError of graphQLErrors) {
    const message = formatGraphqlErrorMessage(graphqlError);

    addToast({ type: "error", content: message, timeout: 4000 });
  }

  if (networkError) {
    addToast({ type: "error", content: "Network error", timeout: 4000 });
  }
});

const httpLink = new HttpLink({ uri: getGraphqlUrl() }).concat(errorLink);

interface ApolloClientOptions {
  forcedAuthToken?: string;
  websocketEndpoint?: string;
}

export const getApolloClient = memoize((options: ApolloClientOptions = {}): ApolloClient<unknown> => {
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
      // Try to read hasura endpoint from _app initial props if option is not provided.
      createSocketLink(options.websocketEndpoint || readAppInitialPropByName("hasuraWebsocketEndpoint")),
      authTokenLink.concat(httpLink)
    );
  }

  const link = getLink();

  const initialCacheState = getApolloInitialState();

  if (initialCacheState) {
    cache.restore(initialCacheState);
  }

  return new ApolloClient({
    ssrMode,
    link,
    cache,
  });
});

interface ApolloClientProviderProps {
  children: ReactNode;
  // On server side, queries are pre-populated using authorized client. This props allows using the same client instance,
  // resulting in initial render having all data in place and avoiding loading state.
  ssrAuthToken?: string | null;
  websocketEndpoint?: string | null;
}

let renderedApolloClient: ApolloClient<unknown> | null;

export function getRenderedApolloClient() {
  return assertGet(renderedApolloClient, "getRenderedApolloClient called before first ApolloClientProvider render");
}

export const ApolloClientProvider = ({ children, ssrAuthToken, websocketEndpoint }: ApolloClientProviderProps) => {
  const client = useConst(() =>
    getApolloClient({
      forcedAuthToken: ssrAuthToken ?? undefined,
      websocketEndpoint: websocketEndpoint ?? undefined,
    })
  );

  renderedApolloClient = client;

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
