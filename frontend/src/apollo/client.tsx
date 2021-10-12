import {
  ApolloClient,
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
import React, { ReactNode, useMemo } from "react";

import { readAppInitialPropByName } from "~frontend/utils/next";
import { TypedTypePolicies } from "~gql";
import { assertDefined } from "~shared/assert";
import { isServer } from "~shared/isServer";
import { Maybe } from "~shared/types";
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
            uri: `${websocketEndpoint ?? readAppInitialPropByName("hasuraWebsocketEndpoint") ?? ""}/v1/graphql`,
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

let renderedApolloClient: ApolloClient<unknown> | null;

export function getRenderedApolloClient() {
  return assertDefined(renderedApolloClient, "getRenderedApolloClient called before first ApolloClientProvider render");
}

export const ApolloClientProvider = ({ children, websocketEndpoint }: ApolloClientProviderProps) => {
  const client = useMemo(() => getApolloClient(websocketEndpoint ?? undefined), [websocketEndpoint]);

  renderedApolloClient = client;

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
