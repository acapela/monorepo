import { ApolloClient, FieldMergeFunction, HttpLink, InMemoryCache, split as splitLinks } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLError } from "graphql";
import { memoize } from "lodash";

import { FRONTEND_URL, WEBSOCKET_URL } from "@aca/desktop/lib/env";
import { createDateParseLink } from "@aca/frontend/src/apollo/dateStringParseLink";
import { TypedTypePolicies } from "@aca/gql";
import { IS_DEV } from "@aca/shared/dev";
import { isClient } from "@aca/shared/document";
import { Maybe } from "@aca/shared/types";
import { addToast } from "@aca/ui/toasts/data";

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
  const rootUrl = FRONTEND_URL;

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

const parseDatesLink = createDateParseLink();

const credentials = "include";

export const getApolloClient = memoize(
  (websocketEndpoint: ApolloClientOptions["websocketEndpoint"]): ApolloClient<unknown> => {
    const link = splitLinks(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === "OperationDefinition" && definition.operation === "subscription";
      },
      new WebSocketLink({
        // Try to read hasura endpoint from _app initial props if option is not provided.
        uri: `${websocketEndpoint ?? ""}/graphql`,
        options: {
          reconnect: true,
          lazy: true,
        },
      }),
      parseDatesLink.concat(
        ENABLE_REQUEST_BATCHING
          ? new BatchHttpLink({ uri: getGraphqlUrl(), credentials, batchMax: 20 })
          : new HttpLink({ uri: getGraphqlUrl(), credentials })
      )
    );

    return new ApolloClient({ credentials, link, cache: new InMemoryCache({ typePolicies }) });
  }
);

export const apolloClient = getApolloClient(WEBSOCKET_URL);
