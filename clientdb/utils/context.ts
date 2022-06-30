import { ApolloClient } from "@apollo/client";

import { createDbContext } from "@acapela/clientdb";

export const userIdContext = createDbContext<string | null>();
export const teamIdContext = createDbContext<string | null>();
export const apolloContext = createDbContext<ApolloClient<unknown>>();
