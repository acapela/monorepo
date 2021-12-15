import {
  ApolloClient,
  ApolloProvider,
  FieldMergeFunction,
  HttpLink,
  InMemoryCache,
  split as splitLinks,
} from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLError } from "graphql";
import { memoize } from "lodash";
import React, { ReactNode } from "react";

import { readAppInitialPropByName } from "~frontend/utils/next";
import { TypedTypePolicies } from "~gql";
import { IS_DEV } from "~shared/dev";
import { isClient } from "~shared/document";
import { useConst } from "~shared/hooks/useConst";
import { isServer } from "~shared/isServer";
import { Maybe } from "~shared/types";
import { addToast } from "~ui/toasts/data";

import { createDateParseLink } from "./dateStringParseLink";

const mergeUsingIncoming: FieldMergeFunction<unknown, unknown> = (old, fresh) => fresh;

const ENABLE_REQUEST_BATCHING = true;

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

interface ApolloClientOptions {
  forcedAuthToken?: Maybe<string>;
  websocketEndpoint?: string;
}

/**
 * This flag can be enabled in dev to debug locally with production data.
 *
 * The flow is:
 * Enable this flag.
 * App will crash saying JWT is incorrect or user is null.
 * Click log out locally
 * Log in again (locally)
 * Open acapela app (production) and login (or do nothing if logged in)
 * In dev tools > copy session token
 * In dev tools of local app > paste session token and set SameOriginPolicy to none (by default is LEX)
 * Reload the app locally. You should be able to see production data.
 */
const DEBUG_PRODUCTION_LOCALLY = IS_DEV && false;

function getGraphqlUrl() {
  const rootUrl = process.env.FRONTEND_URL ?? process.env.NEXTAUTH_URL ?? "";

  if (DEBUG_PRODUCTION_LOCALLY) {
    return `https://app.acape.la/graphql`;
  }

  return `${rootUrl}/graphql`;
}

function formatGraphqlErrorMessage(error: GraphQLError) {
  if (process.env.NODE_ENV === "development") {
    const { message, locations, path } = error;
    return `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`;
  }

  return `Failed to finish the operation`;
}

if (isClient) {
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
}

/**
 * Batch queries with short interval. This is useful if multiple requests are sent quickly (especially during initial loading), as
 * they might be resolved by hasura and sent in one go, resulting in overall faster response
 */
const httpRawLink = ENABLE_REQUEST_BATCHING
  ? new BatchHttpLink({
      uri: getGraphqlUrl(),
      batchMax: 20,
      credentials: DEBUG_PRODUCTION_LOCALLY ? "include" : undefined,
    })
  : new HttpLink({
      uri: getGraphqlUrl(),
      credentials: DEBUG_PRODUCTION_LOCALLY ? "include" : undefined,
    });
const parseDatesLink = createDateParseLink();

const httpLink = parseDatesLink.concat(httpRawLink);

export const getApolloClient = memoize(
  (websocketEndpoint: ApolloClientOptions["websocketEndpoint"]): ApolloClient<unknown> => {
    const link = isServer
      ? httpLink
      : splitLinks(
          ({ query }) => {
            const definition = getMainDefinition(query);
            return definition.kind === "OperationDefinition" && definition.operation === "subscription";
          },
          new WebSocketLink({
            // Try to read hasura endpoint from _app initial props if option is not provided.
            uri: `${websocketEndpoint ?? readAppInitialPropByName("hasuraWebsocketEndpoint") ?? ""}/graphql`,
            options: {
              reconnect: true,
              lazy: true,
            },
          }),
          httpLink
        );

    return new ApolloClient({
      credentials: "include",
      ssrMode: isServer,
      link,
      cache: new InMemoryCache({ typePolicies }),
    });
  }
);

interface ApolloClientProviderProps {
  children: ReactNode;
  websocketEndpoint?: string | null;
}

export const ApolloClientProvider = ({ children, websocketEndpoint }: ApolloClientProviderProps) => {
  const client = useConst(() => getApolloClient(websocketEndpoint ?? undefined));

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
