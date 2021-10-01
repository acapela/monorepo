import { ApolloClient } from "@apollo/client";

import { createDbContext } from "~clientdb/entity/context";

export const userIdContext = createDbContext<string>();
export const teamIdContext = createDbContext<string | null>();
export const apolloContext = createDbContext<ApolloClient<unknown>>();
