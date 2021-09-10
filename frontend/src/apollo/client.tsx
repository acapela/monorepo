import { IncomingMessage } from "http";

import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  FieldMergeFunction,
  HttpLink,
  InMemoryCache,
  split as splitLinks,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLError } from "graphql";
import { memoize } from "lodash";
import { NextApiRequest } from "next";
import React, { ReactNode } from "react";

import { TOKEN_COOKIE_NAME, readCurrentToken } from "~frontend/authentication/cookie";
import { getApolloInitialState } from "~frontend/gql/utils/hydration";
import { readAppInitialPropByName } from "~frontend/utils/next";
import { TypedTypePolicies } from "~gql";
import { assertDefined } from "~shared/assert";
import { useConst } from "~shared/hooks/useConst";
import { isServer } from "~shared/isServer";
import { addToast } from "~ui/toasts/data";

import { createDateParseLink } from "./dateStringParseLink";

const mergeUsingIncoming: FieldMergeFunction<unknown, unknown> = (old, fresh) => fresh;

/**
 * Apollo wants to make sure that it does not lose data, so it emits warnings when there is no merge function for arrays
 * from which elements might be removed. Hence we define these explicitly.
 */
const typePolicies: TypedTypePolicies = {
  Query: {
    fields: {
      topic: {
        merge: mergeUsingIncoming,
      },
      message: {
        merge: mergeUsingIncoming,
      },
    },
  },
  Subscription: {
    fields: {
      topic: {
        merge: mergeUsingIncoming,
      },
      message: {
        merge: mergeUsingIncoming,
      },
    },
  },
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
  room: {
    fields: {
      topics: {
        merge: mergeUsingIncoming,
      },
    },
  },
  topic: {
    fields: {
      messages: {
        merge: mergeUsingIncoming,
      },
    },
  },
  message: {
    fields: {
      message_reactions: { merge: mergeUsingIncoming },
    },
  },
};

/**
 * Create cache and try to populate it if there is pre-fetched data
 *
 * We keep it in module scope as it has to be re-used between server side page renders (1 render - data requirements collection, 2nd render - render with pre-fetched cache)
 *
 * We'll however have to clear this cache between requests.
 *
 * TODO: Maybe something like unique request id would simplify it so we'd attach cache-per-request, this way we can do pre-fetching
 * but it's harder to make security bug.
 */
let cache = new InMemoryCache({ typePolicies });

export function clearApolloCache() {
  cache = new InMemoryCache({ typePolicies });
}

export function readTokenFromRequest(req?: IncomingMessage): string | null {
  if (!req) return null;

  const nextRequest = req as NextApiRequest;
  return nextRequest.cookies?.[TOKEN_COOKIE_NAME] ?? null;
}

const createAuthorizationHeaderLink = (forcedAuthToken?: string) =>
  new ApolloLink((operation, forward) => {
    const { headers = {} } = operation.getContext();

    const authToken = forcedAuthToken ?? readCurrentToken();

    if (!authToken) {
      return forward(operation);
    }

    operation.setContext({
      headers: {
        Authorization: `Bearer ${authToken}`,
        ...headers,
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
onError(({ graphQLErrors = [], networkError }) => {
  for (const graphqlError of graphQLErrors) {
    const message = formatGraphqlErrorMessage(graphqlError);

    addToast({ type: "error", title: message, timeout: 4000 });
  }

  if (networkError) {
    addToast({ type: "error", title: "Network error", timeout: 4000 });
  }
});

const httpRawLink = new HttpLink({ uri: getGraphqlUrl() });
const parseDatesLink = createDateParseLink();

const httpLink = parseDatesLink.concat(httpRawLink);

interface ApolloClientOptions {
  forcedAuthToken?: string;
  websocketEndpoint?: string;
}

export const getApolloClient = memoize((options: ApolloClientOptions = {}): ApolloClient<unknown> => {
  if (!isServer) {
    // Client side - never use forced token and always read one dynamically
    options.forcedAuthToken = undefined;
  }

  const authTokenLink = createAuthorizationHeaderLink(options.forcedAuthToken);

  function getLink() {
    if (isServer) {
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
    ssrMode: isServer,
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
  return assertDefined(renderedApolloClient, "getRenderedApolloClient called before first ApolloClientProvider render");
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
